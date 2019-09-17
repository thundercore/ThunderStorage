import config from '../config'
import { logger } from './logger'

export function profile(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value
  descriptor.value = async function() {
    if (config.debug.benchmark) {
      const profiler = logger.startTimer()
      const result = await originalMethod.apply(this, arguments)
      profiler.done({
        id: 'profile',
        level: 'debug',
        message: `\x1b[33mtime [${
          target.constructor.name
        }#${propertyKey}]\x1b[0m`
      })
      return result
    } else {
      return await originalMethod.apply(this, arguments)
    }
  }
  return descriptor
}
