export type { ApiResponse, PaginatedResponse, RequestOptions } from '@core/http'
export type { ApiErrorCode } from '@core/http'

export interface SelectOption<T = string> {
  value: T
  label: string
  disabled?: boolean
}

export interface TableColumn<T> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: T[keyof T], row: T) => React.ReactNode
}
