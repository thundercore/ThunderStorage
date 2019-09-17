import { ErrorOption, ResponseError } from './ResponseError'
import { ResponseErrors } from '../constants/ResponseErrors'

export class UnhealthyError extends ResponseError {
  constructor(message: string, options?: ErrorOption) {
    super(ResponseErrors.ValidationError, message, 503, options)
  }
}
