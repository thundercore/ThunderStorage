import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Partners } from '../constants/Partners'

interface IToken {
  iat: number
  exp: number
  aud: string
  iss: string
  sub: string
}

@Injectable()
export class AuthService {
  static SigningOptions = {
    issuer: 'ThunderCore',
    algorithm: 'HS256'
  }

  constructor(private readonly jwtService: JwtService) {}

  login(clientId: string, clientSecret: string) {
    // TODO handle this case in the future for now just give IVoter a non expiring token
    // if (clientId === '1' && clientSecret === '1') {
    //   return this.jwtService.sign(
    //     {},
    //     {
    //       ...AuthService.SigningOptions,
    //       subject: Partners.IVoter
    //     }
    //   )
    // }
    // throw new VError('invalid login')
  }

  verifyAndDecode(token: string) {
    return this.jwtService.verify<IToken>(token)
  }
}
