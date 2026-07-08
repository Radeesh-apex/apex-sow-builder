// src\modules\contact\hooks\useContactForm.ts
import { useState } from 'react'
import { useApiCall } from '@shared/hooks'
import { sanitizeText, isEmail, isRequired, minLength } from '@shared/utils'
import { contactService, type ContactPayload, type ContactResponse } from '../services/contactService'

type FormField = keyof ContactPayload

interface FormErrors extends Partial<Record<FormField, string>> {}

const EMPTY: ContactPayload = { name: '', email: '', subject: '', message: '' }

export function useContactForm() {
  const [form, setForm] = useState<ContactPayload>(EMPTY)
  const [errors, setErrors] = useState<FormErrors>({})
  const { status, error, execute, reset } = useApiCall<ContactResponse>()

  const handleChange = (field: FormField, value: string) => {
    const sanitized = sanitizeText(value)
    setForm((f) => ({ ...f, [field]: sanitized }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = (): boolean => {
    const next: FormErrors = {}
    if (!isRequired(form.name)) next.name = 'Name is required.'
    else if (!minLength(form.name, 2)) next.name = 'Name must be at least 2 characters.'
    if (!isRequired(form.email)) next.email = 'Email is required.'
    else if (!isEmail(form.email)) next.email = 'Enter a valid email address.'
    if (!isRequired(form.subject)) next.subject = 'Subject is required.'
    if (!isRequired(form.message)) next.message = 'Message is required.'
    else if (!minLength(form.message, 10)) next.message = 'Message must be at least 10 characters.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = async (): Promise<boolean> => {
    if (!validate()) return false
    const result = await execute((signal) => contactService.submit(form, { signal }))
    if (result) {
      setForm(EMPTY)
      setErrors({})
    }
    return result !== null
  }

  return { form, errors, status, apiError: error, handleChange, submit, reset }
}
