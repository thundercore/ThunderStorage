import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './services/auth.service'
import config from '../../config'
import { IVoterGuard } from './guards/IVoterGuard'

@Module({
  imports: [JwtModule.register({ secret: config.app.jwtSecret })],
  providers: [AuthService, IVoterGuard],
  exports: [AuthService, IVoterGuard]
})
export class AuthModule {}
export { AuthService, IVoterGuard }
