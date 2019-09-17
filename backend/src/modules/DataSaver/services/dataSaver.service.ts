import { Injectable } from '@nestjs/common'
import { DataSaverRepository } from './dataSaver.repository'
import { ContentType } from '../constants/ContentType'
import { Charset } from '../constants/Charset'
import { Transactional } from 'typeorm-transactional-cls-hooked'
import { Wallet } from 'ethers'
import { ContentEncoding } from '../constants/ContentEncoding'
import { RenderType } from '../constants/RenderType'
import { keccak256, populateTransaction } from 'ethers/utils'
import { TransactionDataEntity } from '../entities/TransactionData.entity'
import { DataEntity } from '../entities/Data.entity'
import { FunderService } from './funder.service'
import { MnemonicWallet } from '../../Web3/services/MnemonicWallet'
import { JsonRpcProvider } from 'ethers/providers'

@Injectable()
export class DataSaverService {
  static MinEth = '0.1'
  static TopEth = '1'

  constructor(
    private readonly dataSaverRepo: DataSaverRepository,
    private readonly provider: JsonRpcProvider,
    private readonly funderService: FunderService
  ) {}

  saveJson(json: object, privateKey: string): Promise<TransactionDataEntity> {
    const string = JSON.stringify(json)
    const buffer = Buffer.from(string, 'utf8')

    return this.saveAndSendTransaction(
      new MnemonicWallet(privateKey, this.provider),
      buffer,
      {
        contentType: ContentType.ApplicationJson,
        charset: Charset.UFT8
      },
      RenderType.Survey
    )
  }

  @Transactional()
  async saveAndSendTransaction(
    wallet: MnemonicWallet,
    buffer: Buffer,
    metaData: {
      contentType: ContentType
      contentEncoding?: ContentEncoding
      charset?: Charset
    },
    renderType: RenderType = RenderType.Default
  ): Promise<TransactionDataEntity> {
    // This will possibly delay those transactions that require filling by 1-2secs
    await this.funderService.fillWhenLow(
      wallet,
      DataSaverService.MinEth,
      DataSaverService.TopEth
    )

    const hash = DataSaverRepository.getSha256BufferHash(buffer)

    const {
      transaction,
      transactionHash
    } = await wallet.populateAndSignTransaction({
      to: wallet.address,
      data: '0x' + renderType + hash,
      value: '0x'
    })

    const transactionDataEntity = await this.dataSaverRepo.save(
      buffer,
      { renderType, transactionHash },
      metaData
    )

    await wallet.sendTransaction(transaction)

    return transactionDataEntity
  }

  getData(hash: string): Promise<DataEntity | undefined> {
    return this.dataSaverRepo.get(hash)
  }
}
