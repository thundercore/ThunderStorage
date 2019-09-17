import { ErrorOption, ResponseError } from './ResponseError'
import { ResponseErrors } from '../constants/ResponseErrors'

export class NotFoundError extends ResponseError {
  constructor(message: string, options?: ErrorOption) {
    super(ResponseErrors.NotFound, message, 404, options)
  }
}
