import { sha256, toUtf8Bytes } from 'ethers/utils'
import { fromSeed } from 'ethers/utils/hdnode'
import config from '../config'

export function getWalletFromContent(contents: string[]) {
  const hash = sha256(
    `0x${toUtf8Bytes(
      contents
        .sort()
        .concat(config.app.keySecret)
        .join('')
    ).join('')}`
  )
  return fromSeed(hash)
}
