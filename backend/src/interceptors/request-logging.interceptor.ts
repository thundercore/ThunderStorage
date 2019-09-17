import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common'
import { Request } from 'express'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import * as VError from 'verror'
import { logger } from '../util/logger'

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest()
    const contextId = request.context ? request.context.id : 'no context'

    try {
      logger.info(
        `
-------
REQUEST id=${contextId}
-------
${this.formatRequest(request)}`,
        {
          id: contextId
        }
      )

      const requestStart = Date.now()
      return next.handle().pipe(
        tap(data => {
          // For errors that get caught in the exception filter, data is an
          // observable for some reason
          if (!(data instanceof Observable)) {
            logger.verbose(
              `
--------
RESPONSE id=${contextId}
--------
${this.formatResponse(data, Date.now() - requestStart)}`,
              {
                id: contextId
              }
            )
          }
        })
      )
    } catch (e) {
      logger.error(
        `Couldn't time request for prometheus due to error ${VError.fullStack(
          e
        )}`
      )
      return next.handle()
    }
  }

  private formatRequest(request: Request): string {
    return `${request.method} ${request.url}
clientId=${request.auth ? request.auth.sub : 'no client id'}

body=${JSON.stringify(request.body, null, 2)}
    `
  }

  private formatResponse(data: any, time: number): string {
    return `duration=${(time / 1000.0).toFixed(3)}s
    
body=${JSON.stringify(data, null, 2)}
    `
  }
}
