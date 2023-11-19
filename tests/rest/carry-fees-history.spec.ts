import { createRestClient } from '../../src/rest'
import { beforeAll, describe, it, expect } from 'vitest'

let lnmarkets: ReturnType<typeof createRestClient>
let network: string

beforeAll(() => {
  network = 'testnet'
  lnmarkets = createRestClient({ network })
})

describe('Fetches carry fees history', () => {
  it('Retrieves testnet carryFees history', async () => {
    await lnmarkets.futuresCarryFeesHistory({}).catch((err) => {
      expect(err.status).toBe(401)
      expect(err.statusText).toBe('Unauthorized')
    })
  })
})
