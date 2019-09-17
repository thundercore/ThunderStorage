import { ApiModelProperty } from '@nestjs/swagger'

export class IMetaDataResponse {
  @ApiModelProperty()
  hash: string

  @ApiModelProperty()
  contentType: string

  @ApiModelProperty()
  charset: string

  @ApiModelProperty()
  contentEncoding: string

  @ApiModelProperty()
  contentLength: number

  @ApiModelProperty()
  url: string
}

export class IVoterSavePollResponse {
  @ApiModelProperty()
  viewUrl: string

  @ApiModelProperty()
  metaData: IMetaDataResponse
}

export default { IVoterSavePollResponse }
