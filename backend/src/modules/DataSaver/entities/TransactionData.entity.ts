import { Entity, Column, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm'
import { RenderType } from '../constants/RenderType'
import { MetadataEntity } from './Metadata.entity'

@Entity()
export class TransactionDataEntity {
  // 0x hex representation
  @PrimaryColumn('text')
  transactionHash: string

  @Column({
    type: 'enum',
    enum: RenderType,
    nullable: true
  })
  renderType: RenderType

  @ManyToOne(type => MetadataEntity, {
    cascade: true,
    eager: true
  })
  @JoinColumn()
  metaData: MetadataEntity
}
