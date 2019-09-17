import { MnemonicWallet } from './services/MnemonicWallet'
import { Module } from '@nestjs/common'
import { JsonRpcProvider } from 'ethers/providers'

jest.mock('./services/MnemonicWallet')
jest.mock('ethers/providers')

@Module({
  providers: [JsonRpcProvider, MnemonicWallet],
  exports: [JsonRpcProvider, MnemonicWallet]
})
export class Web3ModuleMock {}
export { JsonRpcProvider, MnemonicWallet }
