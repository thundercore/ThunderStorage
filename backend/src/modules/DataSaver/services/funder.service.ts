import { Injectable } from '@nestjs/common'
import { MnemonicWallet } from '../../Web3/web3.module'
import { Wallet } from 'ethers'
import { parseEther } from 'ethers/utils'

@Injectable()
export class FunderService {
  constructor(private readonly funderWallet: MnemonicWallet) {}

  async fillWhenLow(wallet: Wallet, minEth: string, topEth: string) {
    const curVal = await wallet.getBalance()
    if (curVal.lte(parseEther(minEth))) {
      const transaction = await this.funderWallet.sendTransaction({
        to: wallet.address,
        value: parseEther(topEth).toHexString()
      })
      await transaction.wait()
    }
  }
}
