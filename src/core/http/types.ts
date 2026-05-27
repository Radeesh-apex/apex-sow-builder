export interface ApiResponse<T = unknown> {
  data: T
  status: number
  requestId?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface RequestOptions {
  signal?: AbortSignal
  timeout?: number
  skipAuth?: boolean
  skipErrorToast?: boolean
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
