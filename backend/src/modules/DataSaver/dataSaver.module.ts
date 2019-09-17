import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataEntity } from './entities/Data.entity'
import { MetadataEntity } from './entities/Metadata.entity'
import { DataSaverRepository } from './services/dataSaver.repository'
import { DataSaverService } from './services/dataSaver.service'
import { Web3Module } from '../Web3/web3.module'
import { TransactionDataEntity } from './entities/TransactionData.entity'
import { FunderService } from './services/funder.service'

@Module({
  imports: [
    Web3Module,
    TypeOrmModule.forFeature([
      DataEntity,
      MetadataEntity,
      TransactionDataEntity
    ])
  ],
  providers: [DataSaverRepository, FunderService, DataSaverService],
  controllers: [],
  exports: [DataSaverService]
})
export class DataSaverModule {}

export { DataSaverService }
