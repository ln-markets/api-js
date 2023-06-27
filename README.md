# @ln-markets/api

<p align="center">
  <a href="https://www.npmjs.com/package/@ln-markets/api" alt="npm version">
    <img src="https://img.shields.io/npm/v/@ln-markets/api" />
  </a>
  <a href="https://www.npmjs.com/package/@ln-markets/api" alt="npm downloads">
    <img src="https://img.shields.io/npm/dw/@ln-markets/api" />
  </a>
  <a href="https://twitter.com/LNMarkets">
    <img src="https://img.shields.io/twitter/follow/LNMarkets?style=social"
        alt="Follow us on Twitter">
  </a>
</p>

[@ln-markets/api](https://www.npmjs.com/package/@ln-markets/api) is a simple way to connect your Node JS application to [LN Markets](https://lnmarkets.com) !

## Install

You can install this package with npm or yarn:

```shell
  $> npm install @ln-markets/api
```

```shell
  $> pnpm install @ln-markets/api
```

```shell
  $> yarn add @ln-markets/api
```

Then go to on your LN Markets account under the API section of the Profile to generate an API Key with the right permissions to fit your needs.

## Usage

You can import either use websocket or rest api from `@ln-markets/api`

:warning: **This module does not work in the browser**
:warning: **This package only work with ES Modules**

```javascript
import { createRestClient, createWebsocketClient } from '@ln-markets/api'
```

## REST API

Create a new client with the `createRestClient` function

```javascript
import { createRestClient } from '@ln-markets/api'
const client = createRestClient()
```

All these functions are wrappers for documented public endpoints from LN Markets API v2. See specification [here](https://docs.lnmarkets.com/api/v2/).

You can use the `client.request` for routes that are not implemented yet.

### Configuration

You can pass the `network` and `version` to the builder function

By default the package will connect to the mainnet api.

#### Authentication

> For authentication you need your api **key** **secret** and **passphrase**

Without you will not bet able to authenticate and use routes that require authentication

> :warning: **Never share your API Key, Secret or Passphrase**

- As a js variable

```javascript
import { createRestClient } from '@ln-markets/api'
const key = `<LNM API KEY>`
const secret = `<LNM API SECRET>`
const passphrase = `<LNM API PASSPHRASE>`

const client = new createRestClient({ key, secret, passphrase })

const trades = await client.futuresGetTrades()
console.log(trades)
```

- As env variable

```javascript
// process.env.LNM_API_KEY = `<LNM API KEY>`
// process.env.LNM_API_SECRET = `<LNM API SECRET>`
// process.env.LNM_API_PASSPHRASE = `<LNM API PASSPHRASE>`

const client = new createRestClient({ key, secret })

const trades = await client.futuresGetTrades()
console.log(trades)
```

#### Network

```javascript
import { createRestClient } from '@ln-markets/api'
const client = createRestClient({ network: 'testnet' })
```

- Pass `LNM_API_NETWORK` env var to your app

```javascript
// process.env.LNM_API_NETWORK = 'testnet'
import { createRestClient } from '@ln-markets/api'
const client = createRestClient()
```

#### Version

```javascript
import { createRestClient } from '@ln-markets/api'
const client = createRestClient({ version: 'v42' })
```

- Pass `LNM_API_VERSION` env var to your app

```javascript
// process.env.LNM_API_VERSION = 'v42'
import { createRestClient } from '@ln-markets/api'
const client = createRestClient()
```

#### Headers

Add custom headers to your requests

```javascript
import { createRestClient } from '@ln-markets/api'
const client = createRestClient({
  headers: {
    'X-My-Header': 'My value',
  },
})
```

## Websocket API

> :warning: **Websocket API only support subscription**

Websocket API is limited now for price and index update.

The message format is using [JSON-RPC](https://www.jsonrpc.org/specification) spec.

```javascript
import { createWebsocketClient } from '@ln-markets/api'
// Need to be async
const client = await createWebsocketClient()

await client.subscribe(['futures:btc_usd:last-price', 'futures:btc_usd:index'])

// Event on all response
client.on('response', console.log)
// Event emitter on subscribed channels
client.on('futures:btc_usd:last-price', console.log)
client.on('futures:btc_usd:index', console.log)

// Handle websocket error here
client.ws.on('error', console.error)
```

### Configuration

#### Network

- Testnet with constructor params

```javascript
import { createWebsocketClient } from '@ln-markets/api'
const client = createWebsocketClient({ network: 'testnet' })
```

- Pass `LNM_API_NETWORK` env var to your app

```javascript
// process.env.LNM_API_NETWORK = 'testnet'
import { createWebsocketClient } from '@ln-markets/api'
const client = createWebsocketClient()
```

#### Version

```javascript
import { createWebsocketClient } from '@ln-markets/api'
const client = createWebsocketClient({ version: 'v42' })
```

- Pass `LNM_API_VERSION` env var to your app

```javascript
// process.env.LNM_API_VERSION = 'v42'
import { createWebsocketClient } from '@ln-markets/api'
const client = createWebsocketClient()
```

#### Hearthbeat

Default to `true` will send a ping every 5s to the server to keep the connection alive.

```javascript
import { createWebsocketClient } from '@ln-markets/api'
const client = createWebsocketClient({ heartbeat: false })
```
