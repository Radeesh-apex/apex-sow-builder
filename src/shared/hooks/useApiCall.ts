import { useState, useCallback, useRef, useEffect } from 'react'
import type { Status } from '@shared/types/common'
import { ApiError } from '@core/http'

interface UseApiCallState<T> {
  data: T | null
  status: Status
  error: ApiError | null
}

interface UseApiCallReturn<T> extends UseApiCallState<T> {
  execute: (fn: (signal: AbortSignal) => Promise<T>) => Promise<T | null>
  reset: () => void
  loading: boolean
}

export function useApiCall<T>(): UseApiCallReturn<T> {
  const [state, setState] = useState<UseApiCallState<T>>({ data: null, status: 'idle', error: null })
  const abortRef = useRef<AbortController | null>(null)

  // Cancel in-flight request on unmount
  useEffect(() => () => { abortRef.current?.abort() }, [])

  const execute = useCallback(async (fn: (signal: AbortSignal) => Promise<T>): Promise<T | null> => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setState({ data: null, status: 'loading', error: null })
    try {
      const data = await fn(controller.signal)
      setState({ data, status: 'success', error: null })
      return data
    } catch (err) {
      if (controller.signal.aborted) return null
      const apiError = err instanceof ApiError ? err : new ApiError(String(err), 0, 'UNKNOWN')
      setState({ data: null, status: 'error', error: apiError })
      return null
    }
  }, [])

  const reset = useCallback(() => {
    abortRef.current?.abort()
    setState({ data: null, status: 'idle', error: null })
  }, [])

  return { ...state, loading: state.status === 'loading', execute, reset }
}
