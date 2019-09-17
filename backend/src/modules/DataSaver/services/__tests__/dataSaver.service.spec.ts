import { DataSaverService } from '../dataSaver.service'
import { DataSaverRepository } from '../dataSaver.repository'
import { FunderService } from '../funder.service'
import { ContentType } from '../../constants/ContentType'
import { Test } from '@nestjs/testing'
import {
  JsonRpcProvider,
  MnemonicWallet,
  Web3ModuleMock
} from '../../../Web3/web3.module.mock'

jest.mock('../funder.service')
jest.mock('../dataSaver.repository')
jest.mock('ethers/utils/transaction')
jest.mock('ethers/utils/keccak256')
jest.mock('typeorm-transactional-cls-hooked', () => {
  return {
    Transactional: () => () => {}
  }
})

describe('data saver service', () => {
  let dataSaverService: DataSaverService
  let mockedFunder: FunderService
  let mockedRepo: DataSaverRepository

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [Web3ModuleMock],
      providers: [DataSaverRepository, FunderService, DataSaverService]
    }).compile()
    dataSaverService = module.get<DataSaverService>(DataSaverService)
    mockedFunder = module.get<FunderService>(FunderService)
    mockedRepo = module.get<DataSaverRepository>(DataSaverRepository)
  })

  describe('saveAndSendTransaction', function() {
    it('tries to fund first, saves into the db then sends the transaction', async () => {
      const wallet = new MnemonicWallet('', new JsonRpcProvider())
      ;(wallet.sign as jest.Mock).mockReturnValue('test')
      ;(wallet.populateAndSignTransaction as jest.Mock).mockReturnValue(
        Promise.resolve({})
      )

      await dataSaverService.saveAndSendTransaction(
        wallet,
        new Buffer('', 'binary'),
        {
          contentType: ContentType.ApplicationJson
        }
      )

      expect(mockedFunder.fillWhenLow).toHaveBeenCalled()

      expect(mockedRepo.save).toHaveBeenCalled()
      expect(wallet.populateAndSignTransaction).toHaveBeenCalled()
      expect(wallet.sendTransaction).toHaveBeenCalled()
    })
  })
})
