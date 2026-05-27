import axios, { type AxiosError } from 'axios'
import {
  ApiError,
  AuthError,
  ForbiddenError,
  NetworkError,
  NotFoundError,
  ServerError,
  TimeoutError,
  ValidationError,
} from '../apiError'
import { logger } from '../logger'

interface ServerErrorBody {
  message?: string
  detail?: string
  errors?: unknown
}

export function parseAxiosError(error: AxiosError): ApiError {
  const requestId = error.config?.headers?.['X-Request-ID'] as string | undefined

  if (axios.isCancel(error)) {
    return new ApiError('Request cancelled.', 0, 'UNKNOWN', requestId)
  }

  if (error.code === 'ECONNABORTED' || error.code === 'ERR_CANCELED') {
    return new TimeoutError(requestId)
  }

  if (!error.response) {
    return new NetworkError(requestId)
  }

  const { status, data } = error.response
  const body = data as ServerErrorBody | undefined
  const serverMessage = body?.message ?? body?.detail

  logger.error(`← HTTP ${status} ${error.config?.url}`, { requestId, body })

  switch (status) {
    case 400:
      return new ValidationError(serverMessage ?? 'Invalid request.', body?.errors, requestId)
    case 401:
      return new AuthError(serverMessage, requestId)
    case 403:
      return new ForbiddenError(requestId)
    case 404:
      return new NotFoundError(undefined, requestId)
    case 422:
      return new ValidationError(serverMessage ?? 'Validation failed.', body?.errors, requestId)
    case 429:
      return new ApiError('Too many requests. Please slow down.', 429, 'RATE_LIMITED', requestId)
    default:
      if (status >= 500) return new ServerError(requestId)
      return new ApiError(serverMessage ?? 'An error occurred.', status, 'UNKNOWN', requestId)
  }
}
