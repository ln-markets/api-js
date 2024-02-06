import { createWebsocketClient } from '../src/index.js'
import console from 'node:console'

const client = await createWebsocketClient({ network: 'testnet' })

const channels = await client.publicChannels()

console.log(channels)

await client.publicSubscribe(['futures:btc_usd:last-price'])

client.ws.on('message', (data) => {
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  console.log(data.toString())
})
