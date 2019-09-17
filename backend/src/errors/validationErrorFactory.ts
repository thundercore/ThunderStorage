import { ValidationError as ClassValidationError } from 'class-validator'
import { ValidationError } from './response-errors/ValidationError'

const getError = (basePath: string, error: ClassValidationError) => {
  const path = basePath + error.property
  let errors = {}
  if (error.children && error.children.length) {
    errors = error.children.reduce((acc, child) => {
      return {
        ...acc,
        ...getError(path + '.', child)
      }
    }, {})
  }

  return error.constraints
    ? {
        [path]: Object.values(error.constraints).join(', '),
        ...errors
      }
    : errors
}

export const validationErrorFactory = (errors: ClassValidationError[]) => {
  const info = errors.reduce((acc, error) => {
    return {
      ...acc,
      ...getError('', error)
    }
  }, {})
  return new ValidationError('Validation error', { info })
}
