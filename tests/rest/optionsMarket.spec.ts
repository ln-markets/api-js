/* ~~/tests/rest/optionsMarket.spec.ts */

// imports
import { createRestClient } from '../../src/rest'
import { beforeAll, describe, it, expect } from 'vitest'

// custom types
type Limit = { min: number; max: number }
type Market = {
  active: boolean
  limits: {
    count: Omit<Limit, 'min'>
    margin: Limit
    quantity: Limit
  }
  fees: {
    trading: number
  }
}

// persistence
let market: Market
let lnmarkets: ReturnType<typeof createRestClient>
let network: string

beforeAll(() => {
  network = 'testnet'
  lnmarkets = createRestClient({ network })
})

describe('Fetches list of options instruments', () => {
  it('Retrieves testnet list of available options instruments', async () => {
    market = await lnmarkets.optionsMarket()
    const { active, limits, fees } = market
    expect(active).toBeTypeOf('boolean')
    expect(active).toBe(true)
    expect(limits).toBeTruthy()
    expect(limits.count).toBeTruthy()
    expect(limits.margin).toBeTruthy()
    expect(limits.quantity).toBeTruthy()
    for (const limit of [limits.margin, limits.quantity]) {
      const { max, min } = limit
      expect(max).toBeTruthy()
      expect(max).toBeTypeOf('number')
      // expect(min).toBeTruthy() count be zero
      expect(min).toBeTypeOf('number')
    }
    const { max } = limits.count
    expect(max).toBeTruthy()
    expect(max).toBeTypeOf('number')
    const { trading } = fees
    expect(trading).toBeTruthy()
    expect(trading).toBeTypeOf('number')
  })
})
