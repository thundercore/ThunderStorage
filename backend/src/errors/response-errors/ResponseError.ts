import { WError } from 'verror'
import { ResponseErrors } from '../constants/ResponseErrors'
import * as VError from 'verror'

export class ResponseError extends WError {
  constructor(
    name: ResponseErrors,
    message: string,
    readonly statusCode: number = 400,
    options?: ErrorOption
  ) {
    super(
      {
        ...(options instanceof Error ? { cause: options } : options),
        name
      },
      message
    )
  }
}

export type ErrorOption = VError.Options | Error
