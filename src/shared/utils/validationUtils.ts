export const REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-().]{7,20}$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/,
}

export function isEmail(value: string): boolean {
  return REGEX.email.test(value.trim())
}

export function isPhone(value: string): boolean {
  return REGEX.phone.test(value.trim())
}

export function isRequired(value: string | null | undefined): boolean {
  return value !== null && value !== undefined && value.trim().length > 0
}

export function minLength(value: string, min: number): boolean {
  return value.length >= min
}

export function maxLength(value: string, max: number): boolean {
  return value.length <= max
}

// Simple sanitizer — strips HTML tags to prevent stored XSS
export function sanitizeText(value: string): string {
  return value.replace(/<[^>]*>/g, '')
}
