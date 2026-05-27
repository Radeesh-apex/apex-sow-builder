import { useMemo, useState } from 'react'

type FieldName =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'password'
  | 'confirmPassword'
  | 'role'
  | 'department'
  | 'agreeTerms'
  | 'subscribeUpdates'

export interface RegistrationFields {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  role: string
  department: string
  agreeTerms: boolean
  subscribeUpdates: boolean
}

export interface RegistrationErrors {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  confirmPassword?: string
  role?: string
  department?: string
  agreeTerms?: string
}

const initialFields: RegistrationFields = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
  department: '',
  agreeTerms: false,
  subscribeUpdates: true,
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function useRegistration() {
  const [fields, setFields] = useState<RegistrationFields>(initialFields)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({})
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const errors = useMemo<RegistrationErrors>(() => {
    const v: RegistrationErrors = {}
    if (!fields.firstName.trim()) v.firstName = 'First name is required.'
    if (!fields.lastName.trim()) v.lastName = 'Last name is required.'
    if (!fields.email.trim()) v.email = 'Email address is required.'
    else if (!emailRegex.test(fields.email)) v.email = 'Enter a valid email address.'
    if (!fields.password) v.password = 'Password is required.'
    else if (fields.password.length < 8) v.password = 'Password must be at least 8 characters.'
    if (!fields.confirmPassword) v.confirmPassword = 'Confirm your password.'
    else if (fields.confirmPassword !== fields.password) v.confirmPassword = 'Passwords must match.'
    if (!fields.role) v.role = 'Please select a role.'
    if (!fields.department) v.department = 'Please select a department.'
    if (!fields.agreeTerms) v.agreeTerms = 'You must accept the terms to continue.'
    return v
  }, [fields])

  const isFormValid = useMemo(() => Object.keys(errors).length === 0, [errors])

  const visibleErrors = useMemo<RegistrationErrors>(() => {
    const visible: RegistrationErrors = {}
    Object.entries(errors).forEach(([key, value]) => {
      if (value && (submitAttempted || touched[key as FieldName])) {
        visible[key as keyof RegistrationErrors] = value
      }
    })
    return visible
  }, [errors, touched, submitAttempted])

  const touchField = (field: FieldName) => setTouched((prev) => ({ ...prev, [field]: true }))

  const handleFieldChange = (
    field: Exclude<FieldName, 'agreeTerms' | 'subscribeUpdates'>,
    value: string,
  ) => {
    setFields((prev) => ({ ...prev, [field]: value }))
    touchField(field)
  }

  const handleCheckboxChange = (field: 'agreeTerms' | 'subscribeUpdates', value: boolean) => {
    setFields((prev) => ({ ...prev, [field]: value }))
    touchField(field)
  }

  const handleFieldBlur = (field: FieldName) => touchField(field)

  const resetForm = () => {
    setFields(initialFields)
    setTouched({})
    setSubmitAttempted(false)
    setFeedbackMessage('')
  }

  const handleSubmit = async () => {
    setSubmitAttempted(true)
    if (!isFormValid) {
      setFeedbackMessage('Please review the highlighted fields and accept the terms before continuing.')
      return
    }
    setIsSubmitting(true)
    setFeedbackMessage('')
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setIsSubmitting(false)
    setFeedbackMessage('Success! Your registration request has been submitted.')
  }

  return {
    fields,
    errors,
    visibleErrors,
    feedbackMessage,
    isSubmitting,
    isFormValid,
    handleFieldChange,
    handleCheckboxChange,
    handleFieldBlur,
    handleSubmit,
    resetForm,
  }
}
