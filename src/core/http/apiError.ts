export type ApiErrorCode =
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'AUTH_REQUIRED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR'
  | 'UNKNOWN'

export class ApiError extends Error {
  readonly status: number
  readonly code: ApiErrorCode
  readonly requestId?: string
  readonly details?: unknown

  constructor(message: string, status: number, code: ApiErrorCode, requestId?: string, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.requestId = requestId
    this.details = details
  }

  get isClientError() { return this.status >= 400 && this.status < 500 }
  get isServerError() { return this.status >= 500 }
  get isRetryable() { return this.status === 429 || this.status >= 500 }
}

export class NetworkError extends ApiError {
  constructor(requestId?: string) {
    super('Network unavailable. Check your internet connection.', 0, 'NETWORK_ERROR', requestId)
    this.name = 'NetworkError'
  }
}

export class TimeoutError extends ApiError {
  constructor(requestId?: string) {
    super('Request timed out. Please try again.', 0, 'TIMEOUT', requestId)
    this.name = 'TimeoutError'
  }
}

export class AuthError extends ApiError {
  constructor(message = 'Authentication required.', requestId?: string) {
    super(message, 401, 'AUTH_REQUIRED', requestId)
    this.name = 'AuthError'
  }
}

export class ForbiddenError extends ApiError {
  constructor(requestId?: string) {
    super('You do not have permission to perform this action.', 403, 'FORBIDDEN', requestId)
    this.name = 'ForbiddenError'
  }
}

export class NotFoundError extends ApiError {
  constructor(resource = 'Resource', requestId?: string) {
    super(`${resource} not found.`, 404, 'NOT_FOUND', requestId)
    this.name = 'NotFoundError'
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: unknown, requestId?: string) {
    super(message, 422, 'VALIDATION_ERROR', requestId, details)
    this.name = 'ValidationError'
  }
}

export class ServerError extends ApiError {
  constructor(requestId?: string) {
    super('An unexpected server error occurred. Please try again later.', 500, 'SERVER_ERROR', requestId)
    this.name = 'ServerError'
  }
}
