import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs'
import { AuthService } from '../services/auth.service'
import { Request } from 'express'
import { UnauthorizedError } from '../../../errors/response-errors/UnauthorizedError'
import { Partners } from '../constants/Partners'

@Injectable()
export class IVoterGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest()
    const authHeader = request.header('Authorization') || ''
    try {
      const token = this.authService.verifyAndDecode(
        authHeader.split('Bearer ')[1]
      )
      return token.sub === Partners.IVoter
    } catch (e) {
      throw new UnauthorizedError('Unauthorized', e)
    }
  }
}
