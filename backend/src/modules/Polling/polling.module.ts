import { Module } from '@nestjs/common'
import {
  DataSaverModule,
  DataSaverService
} from '../DataSaver/dataSaver.module'
import { IVoter } from './services/IVoter'
import config from '../../config'

@Module({
  imports: [DataSaverModule],
  providers: [
    {
      provide: IVoter,
      useFactory: (dataService: DataSaverService) =>
        new IVoter(config.app.thunderScanUrl, dataService),
      inject: [DataSaverService]
    }
  ],
  exports: [IVoter]
})
export class PollingModule {}
