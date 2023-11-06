/* ~~/tests/rest/indexHistory.spec.ts */

// imports
import { createRestClient } from '../../src/rest'
import { beforeAll, describe, it, expect } from 'vitest'

// persistence
let lnmarkets: ReturnType<typeof createRestClient>
let network: string

beforeAll(() => {
  network = 'testnet'
  lnmarkets = createRestClient({ network })
})

describe('Fetches price history', () => {
  it('Retrieves latest testnet index history containing time and value numeric pairs', async () => {
    const indexHistory: { time: number; value: number }[] =
      await lnmarkets.futuresIndexHistory({})
    for (const item of indexHistory) {
      const { time, value } = item
      expect(time).toBeTruthy()
      expect(time).toBeTypeOf('number')
      expect(value).toBeTruthy()
      expect(value).toBeTypeOf('number')
    }
  })
})
