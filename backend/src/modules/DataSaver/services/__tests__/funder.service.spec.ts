import { FunderService } from '../funder.service'
import { parseEther } from 'ethers/utils'
import { Test } from '@nestjs/testing'
import { MnemonicWallet, Web3ModuleMock } from '../../../Web3/web3.module.mock'

describe('funder service', () => {
  let mockedWallet: MnemonicWallet
  let funderService: FunderService

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [Web3ModuleMock],
      providers: [FunderService]
    }).compile()
    funderService = module.get<FunderService>(FunderService)
    mockedWallet = module.get<MnemonicWallet>(MnemonicWallet)
  })

  it('should do nothing when the balance is enough', async () => {
    ;(mockedWallet.getBalance as jest.Mock).mockReturnValue(parseEther('4'))
    await funderService.fillWhenLow(mockedWallet, '2', '5')
    expect(mockedWallet.sendTransaction).not.toHaveBeenCalled()
  })

  it('should send a transaction to the wallet with the top up value and wait for the confirmation', async () => {
    ;(mockedWallet.getBalance as jest.Mock).mockReturnValue(parseEther('1'))
    const waitFn = jest.fn()
    ;(mockedWallet.sendTransaction as jest.Mock).mockReturnValue({
      wait: waitFn
    })

    await funderService.fillWhenLow(mockedWallet, '2', '5')
    expect(mockedWallet.sendTransaction).toHaveBeenCalledTimes(1)
    expect(mockedWallet.sendTransaction).toHaveBeenCalledWith({
      to: mockedWallet.address,
      value: parseEther('5').toHexString()
    })
    expect(waitFn).toHaveBeenCalledTimes(1)
  })
})
