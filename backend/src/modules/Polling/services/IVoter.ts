import { Injectable } from '@nestjs/common'
import { DataSaverService } from '../../DataSaver/services/dataSaver.service'
import { getWalletFromContent } from '../../../util/wallet'
import { MetadataEntity } from '../../DataSaver/entities/Metadata.entity'
import { ISurvey } from '../types/ISurvey'

interface ISaveResult {
  viewUrl: string
  metaData: MetadataEntity
}

@Injectable()
export class IVoter {
  constructor(
    private readonly thunderScanUrl: string,
    private readonly dataSaver: DataSaverService
  ) {}

  async savePollResult(vote: ISurvey): Promise<ISaveResult> {
    // we will sort the pools by the questions
    const sortedQuestion = vote.questions
      .map(poll => poll.question)
      .sort((a, b) => {
        return a > b ? 1 : -1
      })

    const wallet = getWalletFromContent([vote.title].concat(sortedQuestion))
    const transEntity = await this.dataSaver.saveJson(vote, wallet.privateKey)
    return {
      viewUrl:
        this.thunderScanUrl + `/transactions/${transEntity.transactionHash}`,
      metaData: transEntity.metaData
    }
  }
}
