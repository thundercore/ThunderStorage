import * as winston from 'winston'
import { isError } from './index'

export type LogLevel = 'error' | 'warn' | 'info' | 'verbose' | 'debug'

const format = winston.format.printf(info => {
  const message = isError(info) ? info : info.message

  const label = info.id ? info.id : 'no context'

  const duration =
    info.durationMs !== undefined ? `duration=${info.durationMs}ms` : ''
  return `${info.timestamp} [${label}] ${info.level}: ${message} ${duration}`
})

const appendTimestamp = winston.format((info, opts) => {
  info.timestamp = new Date().toISOString()
  return info
})

export const transports = {
  console: new winston.transports.Console({
    level: process.env.LOG_LEVEL || 'info'
  })
}

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.label({ label: 'main' }),
    appendTimestamp(),
    format
  ),
  transports: [transports.console]
})
