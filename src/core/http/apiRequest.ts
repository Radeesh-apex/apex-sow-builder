import type { AxiosRequestConfig } from 'axios'
import { httpClient } from './httpClient'
import type { ApiResponse, PaginatedResponse, RequestOptions } from './types'

function buildConfig(options: RequestOptions = {}): AxiosRequestConfig {
  const config: AxiosRequestConfig = {}
  if (options.signal) config.signal = options.signal
  if (options.timeout) config.timeout = options.timeout
  if (options.skipAuth) config.headers = { ...config.headers, 'X-Skip-Auth': '1' }
  return config
}

// ── Core request wrappers ────────────────────────────────────────────────────

export async function get<T>(url: string, params?: Record<string, unknown>, options?: RequestOptions): Promise<T> {
  const { data } = await httpClient.get<T>(url, { params, ...buildConfig(options) })
  return data
}

export async function post<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
  const { data } = await httpClient.post<T>(url, body, buildConfig(options))
  return data
}

export async function put<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
  const { data } = await httpClient.put<T>(url, body, buildConfig(options))
  return data
}

export async function patch<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
  const { data } = await httpClient.patch<T>(url, body, buildConfig(options))
  return data
}

export async function del<T = void>(url: string, options?: RequestOptions): Promise<T> {
  const { data } = await httpClient.delete<T>(url, buildConfig(options))
  return data
}

// ── Paginated GET ────────────────────────────────────────────────────────────

export async function getPaginated<T>(
  url: string,
  params?: Record<string, unknown>,
  options?: RequestOptions,
): Promise<PaginatedResponse<T>> {
  const { data } = await httpClient.get<PaginatedResponse<T>>(url, { params, ...buildConfig(options) })
  return data
}

// ── Typed API response wrapper ───────────────────────────────────────────────

export async function apiRequest<T>(config: AxiosRequestConfig & RequestOptions): Promise<ApiResponse<T>> {
  const { data, status, headers } = await httpClient.request<T>(buildConfig(config))
  return { data, status, requestId: headers?.['x-request-id'] as string | undefined }
}

// ── CRUD service factory ─────────────────────────────────────────────────────
// Usage: const userService = createApiService<User>('/users')

export function createApiService<T, CreateDto = Partial<T>, UpdateDto = Partial<T>>(basePath: string) {
  return {
    getAll(params?: Record<string, unknown>, options?: RequestOptions) {
      return get<T[]>(basePath, params, options)
    },

    getPaginated(params?: Record<string, unknown>, options?: RequestOptions) {
      return getPaginated<T>(basePath, params, options)
    },

    getById(id: string | number, options?: RequestOptions) {
      return get<T>(`${basePath}/${id}`, undefined, options)
    },

    create(payload: CreateDto, options?: RequestOptions) {
      return post<T>(basePath, payload, options)
    },

    update(id: string | number, payload: UpdateDto, options?: RequestOptions) {
      return put<T>(`${basePath}/${id}`, payload, options)
    },

    partialUpdate(id: string | number, payload: Partial<UpdateDto>, options?: RequestOptions) {
      return patch<T>(`${basePath}/${id}`, payload, options)
    },

    remove(id: string | number, options?: RequestOptions) {
      return del(`${basePath}/${id}`, options)
    },
  }
}
