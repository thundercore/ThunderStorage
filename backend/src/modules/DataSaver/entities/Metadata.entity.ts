import { Entity, Column, PrimaryColumn } from 'typeorm'
import { ContentType } from '../constants/ContentType'
import { Charset } from '../constants/Charset'
import { ContentEncoding } from '../constants/ContentEncoding'

@Entity()
export class MetadataEntity {
  // 0x hex representation
  @PrimaryColumn('text')
  hash: string

  @Column({
    type: 'enum',
    enum: ContentType
  })
  contentType: ContentType

  @Column({
    type: 'enum',
    enum: Charset,
    nullable: true
  })
  charset: Charset

  @Column({
    type: 'enum',
    enum: ContentEncoding,
    default: ContentEncoding.identity
  })
  contentEncoding: ContentEncoding

  @Column({
    type: 'integer'
  })
  contentLength: number

  @Column({ type: 'text' })
  url: string
}
