import { MnemonicWallet } from './services/MnemonicWallet'
import { Module } from '@nestjs/common'
import { JsonRpcProvider } from 'ethers/providers'
import config from '../../config'
import { defaultPath, fromMnemonic } from 'ethers/utils/hdnode'

@Module({
  providers: [
    {
      provide: JsonRpcProvider,
      useFactory: () => {
        const provider = new JsonRpcProvider(config.app.rpcUrl)
        provider.pollingInterval = 400
        return provider
      }
    },
    {
      provide: MnemonicWallet,
      useFactory: (provider: JsonRpcProvider) =>
        new MnemonicWallet(
          fromMnemonic(config.app.mnemonic).derivePath(defaultPath),
          provider
        ),
      inject: [JsonRpcProvider]
    }
  ],
  exports: [JsonRpcProvider, MnemonicWallet]
})
export class Web3Module {}
export { JsonRpcProvider, MnemonicWallet }
