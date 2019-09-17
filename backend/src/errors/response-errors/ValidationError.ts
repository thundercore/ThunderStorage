import { ErrorOption, ResponseError } from './ResponseError'
import { ResponseErrors } from '../constants/ResponseErrors'

export class ValidationError extends ResponseError {
  constructor(message: string, options?: ErrorOption) {
    super(ResponseErrors.ValidationError, message, 400, options)
  }
}
