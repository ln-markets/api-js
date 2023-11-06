/* ~~/tests/rest/ticker.spec.ts */

// imports
import { createRestClient } from '../../src/rest'
import { beforeAll, describe, it, expect } from 'vitest'
import { randomBytes } from 'node:crypto'

// persistence
let lnmarkets: ReturnType<typeof createRestClient>
let network: string

beforeAll(() => {
  network = 'testnet'
  lnmarkets = createRestClient({ network })
})

describe('Fetches latest ticker', () => {
  it('Retrieves latest testnet ticker with four number parameters', async () => {
    const { carryFeeTimestamp, carryIndicativeFeeRate, index, lastPrice } =
      await lnmarkets.futuresGetTicker()
    expect(carryFeeTimestamp).toBeTruthy() // non-zero and non-null
    expect(carryFeeTimestamp).toBeTypeOf('number')
    expect(carryIndicativeFeeRate).toBeTruthy() // non-zero and non-null
    expect(carryIndicativeFeeRate).toBeTypeOf('number')
    expect(index).toBeTruthy() // non-zero and non-null
    expect(index).toBeTypeOf('number')
    expect(lastPrice).toBeTruthy() // non-zero and non-null
    expect(lastPrice).toBeTypeOf('number')
  })
})
