import { Test } from '@nestjs/testing'
import { IVoterGuard } from '../IVoterGuard'
import { AuthService } from '../../auth.module'
import { UnauthorizedError } from '../../../../errors/response-errors/UnauthorizedError'

jest.mock('../../services/auth.service')

describe('IVoter Guard', () => {
  let guard: IVoterGuard
  let authService: AuthService
  beforeAll(async () => {
    const mold = await Test.createTestingModule({
      providers: [AuthService, IVoterGuard]
    }).compile()

    guard = mold.get<IVoterGuard>(IVoterGuard)
    authService = mold.get<AuthService>(AuthService)
  })
  const mockedContext = {
    switchToHttp: () => ({
      // @ts-ignore
      getRequest: () => ({
        header: jest.fn()
      })
    })
  }
  it('returns true when valid', async () => {
    ;(authService.verifyAndDecode as jest.Mock).mockReturnValue({
      sub: 'iVoter'
    })
    // @ts-ignore
    expect(guard.canActivate(mockedContext)).toBeTruthy()
  })

  it('returns false when invalid', async () => {
    ;(authService.verifyAndDecode as jest.Mock).mockReturnValue({
      sub: 'NoMe'
    })
    // @ts-ignore
    expect(guard.canActivate(mockedContext)).toBeFalsy()
  })

  it('throws an unauthorized error when jwt decoding fails', async () => {
    ;(authService.verifyAndDecode as jest.Mock).mockImplementation(() => {
      throw new Error('JWT fails')
    })

    // @ts-ignore
    expect(() => guard.canActivate(mockedContext)).toThrow(UnauthorizedError)
  })
})
