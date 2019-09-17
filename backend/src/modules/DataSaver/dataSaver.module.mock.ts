import { Module } from '@nestjs/common'
import { DataSaverRepository } from './services/dataSaver.repository'
import { DataSaverService } from './services/dataSaver.service'
import { FunderService } from './services/funder.service'
import { Web3ModuleMock } from '../Web3/web3.module.mock'

jest.mock('./services/dataSaver.repository')
jest.mock('./services/dataSaver.service')
jest.mock('./services/funder.service')

@Module({
  imports: [Web3ModuleMock],
  providers: [DataSaverRepository, FunderService, DataSaverService],
  controllers: [],
  exports: [DataSaverService]
})
export class DataSaverModuleMock {}

export { DataSaverService }
