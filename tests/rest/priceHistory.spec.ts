/* ~~/tests/rest/priceHistory.spec.ts */

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
  it('Retrieves latest testnet price history containing time and value numeric pairs', async () => {
    const priceHistory: { time: number;  value: number }[] = await lnmarkets.futuresPriceHistory({})
    for (const item of priceHistory) {
      const { time, value } = item
      expect(time).toBeTruthy()
      expect(time).toBeTypeOf('number')
      expect(value).toBeTruthy()
      expect(value).toBeTypeOf('number')
    }
  })
})
