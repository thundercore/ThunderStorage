import { ErrorOption, ResponseError } from './ResponseError'
import { ResponseErrors } from '../constants/ResponseErrors'

export class InternalExceptionError extends ResponseError {
  constructor(message: string, options?: ErrorOption) {
    super(ResponseErrors.InternalException, message, 500, options)
  }
}
