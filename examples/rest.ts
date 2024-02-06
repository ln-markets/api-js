import { createRestClient } from '../src/index.js'
import console from 'node:console'

const client = createRestClient({ network: 'testnet' })

const ticker = await client.futuresGetTicker()

console.log(ticker)

const user = await client.userGet()

console.log(user)
