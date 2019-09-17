import { parseEnv } from './util'

export default {
  app: {
    rpcUrl: 'https://mainnet-rpc.thundercore.com',
    thunderScanUrl: 'https://scan.thundercore.com',
    mnemonic: parseEnv('MNEMONIC'),
    jwtSecret: parseEnv('JWT_SECRET'),
    keySecret: parseEnv('KEY_SECRET')
  },
  debug: {
    benchmark: false
  }
}
