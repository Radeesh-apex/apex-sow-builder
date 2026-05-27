export function formatDate(date: Date | string | null, locale = 'en-GB'): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return 'Invalid date'
  return d.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatDateTime(date: Date | string | null, locale = 'en-GB'): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return 'Invalid date'
  return d.toLocaleString(locale, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function endOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

export function isToday(date: Date): boolean {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

export function daysBetween(a: Date, b: Date): number {
  return Math.abs(Math.floor((b.getTime() - a.getTime()) / 86_400_000))
}
