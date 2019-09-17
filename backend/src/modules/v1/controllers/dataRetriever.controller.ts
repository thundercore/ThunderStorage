import { Controller, Get, Param, Response } from '@nestjs/common'
import { DataSaverService } from '../../DataSaver/dataSaver.module'
import { Response as ExpressResponse } from 'express'
import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiUseTags
} from '@nestjs/swagger'

@ApiUseTags('data')
@Controller('data')
export class DataRetrieverController {
  constructor(private readonly dataService: DataSaverService) {}

  @ApiOperation({ title: 'Fetch data' })
  @ApiResponse({
    status: 200,
    description: 'returns the content. The content-type will vary'
  })
  @ApiNotFoundResponse({ description: 'content not available' })
  @ApiResponse({ status: 500, description: 'Server Error' })
  @Get('/:hash')
  async getData(@Param('hash') id: string, @Response() res: ExpressResponse) {
    const dataEntity = await this.dataService.getData(id)
    if (!dataEntity) {
      res.status(404).send('Not Found')
    } else {
      const { metaData } = dataEntity
      let contentType: string = metaData.contentType
      if (metaData.charset) {
        contentType += `; charset=${metaData.charset}`
      }

      res.set({
        'Content-Type': contentType,
        'Content-Length': metaData.contentLength,
        'Content-Encoding': metaData.contentEncoding
      })
      res.send(dataEntity.binaryData)
    }
  }
}
