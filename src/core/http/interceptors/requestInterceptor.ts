import type { InternalAxiosRequestConfig } from 'axios'
import { tokenService } from '../tokenService'
import { logger } from '../logger'

export function applyRequestInterceptor(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  // Attach a unique request ID for traceability
  const requestId = crypto.randomUUID()
  config.headers['X-Request-ID'] = requestId
  config.headers['X-Client-Version'] = import.meta.env.VITE_APP_VERSION ?? '1.0.0'

  // Attach auth token unless the route opts out
  if (!config.headers['X-Skip-Auth']) {
    const token = tokenService.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  // Enforce HTTPS in production
  if (import.meta.env.PROD && config.url?.startsWith('http://')) {
    logger.warn('Insecure HTTP request detected — forcing HTTPS', config.url)
    config.url = config.url.replace('http://', 'https://')
  }

  logger.debug(`→ ${config.method?.toUpperCase()} ${config.url}`, { requestId })
  return config
}
