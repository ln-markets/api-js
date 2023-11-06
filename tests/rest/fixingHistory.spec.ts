/* ~~/tests/rest/fixingHistory.spec.ts */

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
  it('Retrieves testnet fixing history containing fee_rate, id, price and time', async () => {
    const fixingHistory: {
      fee_rate: number
      id: string
      price: number
      time: number
    }[] = await lnmarkets.futuresFixingHistory({})
    for (const item of fixingHistory) {
      const { fee_rate, id, price, time } = item
      expect(fee_rate).toBeTruthy()
      expect(fee_rate).toBeTypeOf('number')
      expect(id).toBeTruthy()
      expect(id).toBeTypeOf('string')
      expect(id.length).toBe(36) // dumb tests for uuid
      expect(id.split('-').length).toBe(5) // dumb tests for uuid
      expect(price).toBeTruthy()
      expect(price).toBeTypeOf('number')
      expect(time).toBeTruthy()
      expect(time).toBeTypeOf('number')
    }
  })
})
