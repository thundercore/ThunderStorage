import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  NotFoundException as NestNotFoundException
} from '@nestjs/common'
import { Request } from 'express'
import * as VError from 'verror'
import * as uuidv4 from 'uuid/v4'
import { logger } from '../util/logger'

import { NotFoundError } from './response-errors/NotFoundError'
import { ResponseError } from './response-errors/ResponseError'
import { InternalExceptionError } from './response-errors/InternalExceptionError'
import { UnauthorizedError } from './response-errors/UnauthorizedError'

/**
 * Catches Exceptions for logging and response mapping
 */
@Catch()
export class GeneralExceptionFilter implements ExceptionFilter<Error> {
  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request: Request = ctx.getRequest()

    try {
      const requestId = request.context ? request.context.id : uuidv4()

      // Process exception into VError with code
      const exception = processException(error)
      const info = VError.info(exception)

      const errorResponse = {
        requestId,
        statusCode: exception.statusCode,
        timestamp: new Date().toISOString(),
        path: request.url,
        error: {
          code: exception.name,
          message: exception.message,
          data: info
        }
      }

      logger.error(
        `[${request.method} ${request.url}] ${VError.fullStack(
          exception
        )} metadata=${JSON.stringify(info)}`,
        {
          id: requestId
        }
      )

      response.status(errorResponse.statusCode).json(errorResponse)
    } catch (e) {
      logger.error(e)
      response.status(500).send()
    }
  }
}

/**
 * Converts all exceptions to VErrorCode exceptions with a code
 *
 * @param exception
 */
function processException(exception: Error): ResponseError {
  if (exception instanceof ResponseError) {
    return exception
  }
  if (exception instanceof NestNotFoundException) {
    return new NotFoundError(`Route not found`, exception)
  } else if (exception instanceof ForbiddenException) {
    return new UnauthorizedError('Unauthorized', exception)
  }
  return new InternalExceptionError('Internal Exception', exception)
}
