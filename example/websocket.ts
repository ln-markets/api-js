import { createWebsocketClient } from '../src/websocket'
import console from 'node:console'

const client = await createWebsocketClient({ network: 'testnet' })

const channels = await client.publicChannels()

console.log(channels)

await client.publicSubscribe(['futures:btc_usd:last-price'])

client.ws.on('message', (data) => {
  console.log(data.toString())
})
