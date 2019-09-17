import { Module } from '@nestjs/common'
import { DataSaverModule } from '../DataSaver/dataSaver.module'
import { DataRetrieverController } from './controllers/dataRetriever.controller'
import { PollingController } from './controllers/polling.controller'
import { PollingModule } from '../Polling/polling.module'
import { AuthModule } from '../Auth/auth.module'

@Module({
  imports: [DataSaverModule, PollingModule, AuthModule],
  controllers: [DataRetrieverController, PollingController],
  providers: []
})
export class V1Module {}
