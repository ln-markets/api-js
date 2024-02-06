import { createRestClient } from '../../src/rest'
import { beforeAll, describe, it, expect } from 'vitest'

let instruments: string[]
let lnmarkets: ReturnType<typeof createRestClient>
let network: string

beforeAll(() => {
  network = 'testnet'
  lnmarkets = createRestClient({ network })
})

describe('Fetches list of options instruments', () => {
  it('Retrieves testnet list of available options instruments', async () => {
    instruments = await lnmarkets.optionsInstruments()
    for (const instrument of instruments) {
      expect(instrument).toBeTruthy()
      expect(instrument).toBeTypeOf('string')
      expect(instrument.length).toBeGreaterThan(0)
      const parts = instrument.split('.')
      expect(parts.length).toBe(4)
      expect(parts[0]).toBe('BTC')
      parts[1] === '24H'
        ? void 0
        : expect(parts[1]).toMatch(/^\d{4}-\d{2}-\d{2}/i) // `YYYY-MM-DD`
      expect(parts[2]).toMatch(/^\d+.?\d*/i) // numeric string
      expect(parts[3]).toMatch(/^C|P/i) // either `C` or `P`
    }
  })
})

describe('Get instrument detail specified by name retrieved previously', () => {
  it('Retrieves testnet specified options instrument', async () => {
    instruments = instruments.slice(0, 5) // only test first 5 instruments names
    for (const instrument_name of instruments) {
      const { volatility } = await lnmarkets.optionsInstrument({
        instrument_name,
      })
      expect(volatility).toBeTruthy()
      expect(volatility).toBeTypeOf('number')
      expect(volatility).toBeGreaterThan(0.0)
      expect(volatility).toBeLessThan(1.0)
    }
  })
})
