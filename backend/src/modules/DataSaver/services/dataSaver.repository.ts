import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MetadataEntity } from '../entities/Metadata.entity'
import { ContentType } from '../constants/ContentType'
import { ContentEncoding } from '../constants/ContentEncoding'
import { RenderType } from '../constants/RenderType'
import { Transactional } from 'typeorm-transactional-cls-hooked'
import { Charset } from '../constants/Charset'
import { DataEntity } from '../entities/Data.entity'
import { sha256 } from 'ethers/utils/sha2'
import { TransactionDataEntity } from '../entities/TransactionData.entity'

interface IMetaData {
  contentType: ContentType
  contentEncoding?: ContentEncoding
  charset?: Charset
}

interface ITransactionData {
  transactionHash: string
  renderType?: RenderType
}

@Injectable()
export class DataSaverRepository {
  static getSha256BufferHash(buff: Buffer) {
    // These are  fixed and should only change if we use a different hashing algorithm
    const sha256Code = '12'
    const sha256DigestLength = '20'
    const hashResult = sha256(buff).replace('0x', '')
    return sha256Code + sha256DigestLength + hashResult
  }

  constructor(
    @InjectRepository(DataEntity)
    private readonly dataEntityRepository: Repository<DataEntity>,
    @InjectRepository(MetadataEntity)
    private readonly metadataEntityRepository: Repository<MetadataEntity>,
    @InjectRepository(TransactionDataEntity)
    private readonly transactionDataEntityRepository: Repository<
      TransactionDataEntity
    >
  ) {}

  @Transactional()
  async save(
    binaryData: Buffer,
    transactionData: ITransactionData,
    metaData: IMetaData
  ): Promise<TransactionDataEntity> {
    const hash = '0x' + DataSaverRepository.getSha256BufferHash(binaryData)

    const dataEntity = this.dataEntityRepository.create({
      binaryData
    })

    const metaEntity = this.metadataEntityRepository.create(metaData)
    metaEntity.contentLength = binaryData.length
    metaEntity.hash = hash
    metaEntity.url = '/data/' + hash

    await this.metadataEntityRepository.save(metaEntity)

    const transactionDataEntity = this.transactionDataEntityRepository.create(
      transactionData
    )

    dataEntity.metaData = metaEntity
    transactionDataEntity.metaData = metaEntity

    const [entity] = await Promise.all([
      this.transactionDataEntityRepository.save(transactionDataEntity),
      this.dataEntityRepository.save(dataEntity)
    ])

    return entity
  }

  get(hash: string) {
    return this.dataEntityRepository.findOne(hash)
  }
}
