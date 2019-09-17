import { Test } from '@nestjs/testing'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from '../auth.service'

describe('Auth Service', () => {
  let authService: AuthService
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'shh' })],
      providers: [AuthService]
    }).compile()
    authService = module.get<AuthService>(AuthService)
  })

  const validJwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NjY1NTEzMTYsImlzcyI6IlRodW5kZXJDb3JlIiwic3ViIjoiaVZvdGVyIn0.n-abwXWdFKKdOhtSz89kJrJ6xHA6GeHqGKqUO6ChAGw'
  const invalidJwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NjY1NTEzMTYsImlzcyI6IlRodW5kZXJDb3JlIiwic3ViIjoiaVZvdGVyIn0.n-abwXWdFKKdOhtSz89kJrJ6xHA6GeHqGKqUO6ChA'

  it('correctly verifies and decodes jwt', async () => {
    expect(authService.verifyAndDecode(validJwt)).toEqual({
      iat: 1566551316,
      iss: 'ThunderCore',
      sub: 'iVoter'
    })
  })

  it('throws an error when jwt is invalid', () => {
    expect(() => authService.verifyAndDecode(invalidJwt)).toThrow()
  })
})
