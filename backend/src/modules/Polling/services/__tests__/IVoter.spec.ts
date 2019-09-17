import { DataSaverService } from '../../../DataSaver/services/dataSaver.service'
import { Test } from '@nestjs/testing'
import { DataSaverModuleMock } from '../../../DataSaver/dataSaver.module.mock'
import { IVoter } from '../IVoter'
import { TransactionDataEntity } from '../../../DataSaver/entities/TransactionData.entity'
import { ISurvey } from '../../types/ISurvey'
import { QuestionTypes } from '../../types/questionTypes'

describe('IVoter', () => {
  let dataSaverService: DataSaverService
  let iVoter: IVoter
  const scanUrl = 'http://test.com'

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [DataSaverModuleMock],
      providers: [
        {
          provide: IVoter,
          useFactory: (service: DataSaverService) =>
            new IVoter(scanUrl, service),
          inject: [DataSaverService]
        }
      ]
    }).compile()
    dataSaverService = module.get<DataSaverService>(DataSaverService)
    iVoter = module.get<IVoter>(IVoter)
  })

  const vote1: ISurvey = {
    title: 'my  survey',
    questions: [
      {
        questionType: QuestionTypes.MultipleChoice,
        question: 'q1',
        response: []
      },
      {
        questionType: QuestionTypes.MultipleChoice,
        question: 'q2',
        response: []
      }
    ]
  }

  const vote2: ISurvey = {
    title: 'my  survey',
    questions: [
      {
        questionType: QuestionTypes.MultipleChoice,
        question: 'q2',
        response: []
      },
      {
        questionType: QuestionTypes.MultipleChoice,
        question: 'q1',
        response: []
      }
    ]
  }
  const vote3: ISurvey = {
    title: 'my  survey',
    questions: [
      {
        questionType: QuestionTypes.MultipleChoice,
        question: 'q3',
        response: []
      },
      {
        questionType: QuestionTypes.MultipleChoice,
        question: 'q1',
        response: []
      }
    ]
  }

  it('calls data saver with the same private key', async () => {
    const transEntity = new TransactionDataEntity()
    ;(dataSaverService.saveJson as jest.Mock).mockReturnValue(transEntity)
    await iVoter.savePollResult(vote1)
    await iVoter.savePollResult(vote2)

    expect((dataSaverService.saveJson as jest.Mock).mock.calls[0][1]).toEqual(
      (dataSaverService.saveJson as jest.Mock).mock.calls[1][1]
    )
  })

  it('calls data saver with the different private keys with question is different', async () => {
    const transEntity = new TransactionDataEntity()
    ;(dataSaverService.saveJson as jest.Mock).mockReturnValue(transEntity)
    await iVoter.savePollResult(vote1)
    await iVoter.savePollResult(vote3)
    expect(
      (dataSaverService.saveJson as jest.Mock).mock.calls[0][1]
    ).not.toEqual((dataSaverService.saveJson as jest.Mock).mock.calls[1][1])
  })

  it('returns a url and the metaData', async () => {
    const hash = '2131'
    const transEntity = new TransactionDataEntity()
    transEntity.transactionHash = hash
    ;(dataSaverService.saveJson as jest.Mock).mockReturnValue(transEntity)
    expect(await iVoter.savePollResult(vote1)).toEqual({
      viewUrl: scanUrl + '/transactions/' + hash,
      metaData: transEntity.metaData
    })
  })
})
