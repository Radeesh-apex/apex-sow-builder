import { post } from '@core/http'
import type { RequestOptions } from '@core/http'

export interface ContactPayload {
  name: string
  email: string
  subject: string
  message: string
}

export interface ContactResponse {
  id: string
  submittedAt: string
}

export const contactService = {
  submit(payload: ContactPayload, options?: RequestOptions): Promise<ContactResponse> {
    return post<ContactResponse>('/contact', payload, options)
  },
}
