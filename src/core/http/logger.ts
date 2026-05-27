type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const isDev = import.meta.env.DEV

function log(level: LogLevel, message: string, data?: unknown) {
  if (!isDev && level === 'debug') return
  const timestamp = new Date().toISOString()
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`
  if (data !== undefined) {
    console[level](`${prefix} ${message}`, data)
  } else {
    console[level](`${prefix} ${message}`)
  }
}

export const logger = {
  debug: (msg: string, data?: unknown) => log('debug', msg, data),
  info: (msg: string, data?: unknown) => log('info', msg, data),
  warn: (msg: string, data?: unknown) => log('warn', msg, data),
  error: (msg: string, data?: unknown) => log('error', msg, data),
}
