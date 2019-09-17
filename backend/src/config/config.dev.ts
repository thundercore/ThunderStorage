import { parseEnv } from './util'

export default {
  app: {
    rpcUrl: 'https://testnet-rpc.thundercore.com',
    thunderScanUrl: 'https://scan-testnet.thundercore.com',
    mnemonic: parseEnv('MNEMONIC'),
    jwtSecret: parseEnv('JWT_SECRET'),
    keySecret: parseEnv('KEY_SECRET')
  },
  debug: {
    benchmark: true
  }
}
