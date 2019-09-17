import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  UseGuards
} from '@nestjs/common'
import { RequestLoggingInterceptor } from '../../../interceptors/request-logging.interceptor'
import { IVoter } from '../../Polling/services/IVoter'
import { IVoterSavePoll } from '../types/request'
import { IVoterSavePollResponse } from '../types/response'
import { IVoterGuard } from '../../Auth/auth.module'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnprocessableEntityResponse,
  ApiUnauthorizedResponse,
  ApiUseTags
} from '@nestjs/swagger'

@ApiUseTags('polling')
@Controller('polling')
@UseInterceptors(new RequestLoggingInterceptor())
export class PollingController {
  constructor(private readonly iVoterService: IVoter) {}

  @ApiOperation({ title: 'Save data verification onto chain' })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Invalid Bearer token' })
  @ApiCreatedResponse({ type: IVoterSavePollResponse })
  @ApiUnprocessableEntityResponse({ description: 'Validations failed' })
  @UseGuards(IVoterGuard)
  @Post('ivoter')
  async savePoll(
    @Body() body: IVoterSavePoll
  ): Promise<IVoterSavePollResponse> {
    return await this.iVoterService.savePollResult(body)
  }
}
