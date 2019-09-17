import { DataSaverRepository } from '../dataSaver.repository'

describe('data saver repository', () => {
  it('correctly  hashes its content', async () => {
    expect(
      DataSaverRepository.getSha256BufferHash(
        Buffer.from('testing what is going on', 'utf8')
      )
    ).toEqual(
      '1220b84167f17d6495a2e73455fda75cd947db7fddf2044a7e35edc103818a7b7af7'
    )
  })
})
