import axios from 'axios'
import { applyRequestInterceptor, parseAxiosError } from './interceptors'
import { tokenService } from './tokenService'
import { AuthError } from './apiError'
import { logger } from './logger'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'
const DEFAULT_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT ?? 30_000)

export const httpClient = axios.create({
  baseURL: BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // send HttpOnly refresh-token cookie automatically
})

// ── Request interceptor ──────────────────────────────────────────────────────
httpClient.interceptors.request.use(
  (config) => applyRequestInterceptor(config),
  (error) => Promise.reject(error),
)

// ── Response interceptor ─────────────────────────────────────────────────────
let isRefreshing = false
let refreshQueue: Array<(token: string) => void> = []

httpClient.interceptors.response.use(
  (response) => {
    const requestId = response.config.headers?.['X-Request-ID']
    logger.debug(`← ${response.status} ${response.config.url}`, { requestId })
    return response
  },
  async (error) => {
    const originalRequest = error.config
    const apiErr = parseAxiosError(error)

    // Auto-refresh on 401 (token expired) — queue concurrent requests
    if (apiErr instanceof AuthError && !originalRequest._retried) {
      originalRequest._retried = true

      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            resolve(httpClient(originalRequest))
          })
        })
      }

      isRefreshing = true
      try {
        const { data } = await httpClient.post<{ accessToken: string; expiresIn: number }>(
          '/auth/refresh',
          {},
          { headers: { 'X-Skip-Auth': '1' } },
        )
        tokenService.setAccessToken(data.accessToken, data.expiresIn)
        refreshQueue.forEach((cb) => cb(data.accessToken))
        refreshQueue = []
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return httpClient(originalRequest)
      } catch {
        tokenService.clearTokens()
        refreshQueue = []
        // Redirect to login — the app's auth context will react to this
        window.dispatchEvent(new CustomEvent('auth:logout'))
        return Promise.reject(apiErr)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(apiErr)
  },
)
