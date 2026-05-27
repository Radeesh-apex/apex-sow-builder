export type ID = string | number

export type Status = 'idle' | 'loading' | 'success' | 'error'

export interface BaseEntity {
  id: ID
  createdAt?: string
  updatedAt?: string
}

export type Nullable<T> = T | null

export type Optional<T> = T | undefined

export type ValueOf<T> = T[keyof T]
