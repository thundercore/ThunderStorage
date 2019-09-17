import { Entity, Column, OneToOne, JoinColumn } from 'typeorm'
import { MetadataEntity } from './Metadata.entity'

@Entity()
export class DataEntity {
  @OneToOne(type => MetadataEntity, {
    primary: true,
    eager: true,
    cascade: true
  })
  @JoinColumn()
  metaData: MetadataEntity

  @Column({ type: 'bytea' })
  binaryData: Buffer
}
