import { useState } from 'react'
import { useAuth } from '@core/auth'

interface LoginFields {
  email: string
  password: string
}

interface LoginErrors {
  email?: string
  password?: string
  general?: string
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(fields: LoginFields): LoginErrors {
  const errs: LoginErrors = {}
  if (!fields.email.trim()) errs.email = 'Email is required.'
  else if (!emailRegex.test(fields.email)) errs.email = 'Enter a valid email address.'
  if (!fields.password) errs.password = 'Password is required.'
  else if (fields.password.length < 6) errs.password = 'Password must be at least 6 characters.'
  return errs
}

export function useLogin(onSuccess?: () => void) {
  const { login } = useAuth()
  const [fields, setFields] = useState<LoginFields>({ email: '', password: '' })
  const [errors, setErrors] = useState<LoginErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [touched, setTouched] = useState<Partial<Record<keyof LoginFields, boolean>>>({})

  const visibleErrors: LoginErrors = {}
  if (submitAttempted || touched.email) visibleErrors.email = errors.email
  if (submitAttempted || touched.password) visibleErrors.password = errors.password
  visibleErrors.general = errors.general

  const handleChange = (field: keyof LoginFields, value: string) => {
    setFields((prev) => ({ ...prev, [field]: value }))
    setTouched((prev) => ({ ...prev, [field]: true }))
    setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }))
  }

  const handleBlur = (field: keyof LoginFields) =>
    setTouched((prev) => ({ ...prev, [field]: true }))

  const handleSubmit = async () => {
    setSubmitAttempted(true)
    const errs = validate(fields)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setIsSubmitting(true)
    try {
      // Simulate API call — replace with real httpClient call
      await new Promise<void>((resolve) => setTimeout(resolve, 1000))
      const name = fields.email.split('@')[0].replace(/[._]/g, ' ')
      login(fields.email, name)
      onSuccess?.()
    } catch {
      setErrors({ general: 'Invalid email or password. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    fields,
    visibleErrors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  }
}
