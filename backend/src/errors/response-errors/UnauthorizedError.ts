import { ErrorOption, ResponseError } from './ResponseError'
import { ResponseErrors } from '../constants/ResponseErrors'

export class UnauthorizedError extends ResponseError {
  constructor(message: string, options?: ErrorOption) {
    super(ResponseErrors.Unauthorized, message, 401, options)
  }
}
