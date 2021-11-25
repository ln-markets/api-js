# LN Markets JS API

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

**Note**: This module does not work in the browser.

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

You can import either Websocket or Rest class from `@ln-markets/api`

```JS
  const { LNMarketsWebsocket, LNMarketsRest } = require('@ln-markets/api')

  const websocket = new LNMarketsWebsocket()
  const rest = new LNMarketsRest()
```

## Authentication

> For authentication you need your api **key** **secret** and **passphrase**

Without you will not bet able to authenticate

> :warning: **Never share your API Key, Secret or Passphrase**

### Key

- As a js variable

```JS
  const key = `<LNM API KEY>`
  const { LNMarketsWebsocket } = require('@ln-markets/api')
  const lnm = new LNMarketsWebsocket({ key })
```

- Pass `LNMARKETS_API_KEY` env var to your app

```JS
  // process.env.LNMARKETS_API_KEY = `<LNM API KEY>`
  const { LNMarketsWebsocket } = require('@ln-markets/api')
  const lnm = new LNMarketsWebsocket()
```

### Secret

- As a js variable

```JS
  const secret = `<LNM API SECRET>`
  const { LNMarketsWebsocket } = require('@ln-markets/api')
  const lnm = new LNMarketsWebsocket({ secret })
```

- Pass `LNMARKETS_API_SECRET` env var to your app

```JS
  // process.env.LNMARKETS_API_SECRET = `<LNM API SECRET>`
  const { LNMarketsWebsocket } = require('@ln-markets/api')
  const lnm = new LNMarketsWebsocket()
```

### Passphrase

- As a js variable

```JS
  const passphrase = `<LNM API PASSPHRASE>`
  const { LNMarketsWebsocket } = require('@ln-markets/api')
  const lnm = new LNMarketsWebsocket({ passphrase })
```

- Pass `LNMARKETS_API_PASSPHRASE` env var to your app

```JS
  // process.env.LNMARKETS_API_PASSPHRASE = `<LNM API PASSPHRASE>`
  const { LNMarketsWebsocket } = require('@ln-markets/api')
  const lnm = new LNMarketsWebsocket()
```

## Configuration

You can pass the `network` and `version` in the constructor or specify it with environement variable.

By default the package will connect to the mainnet api.

### Network

- Testnet with constructor params

```JS
  const { LNMarketsWebsocket } = require('@ln-markets/api')
  const lnm = new LNMarketsWebsocket({ network: 'testnet' })
```

- Pass `LNMARKETS_API_NETWORK` env var to your app

```JS
  // process.env.LNMARKETS_API_NETWORK = 'testnet'
  const { LNMarketsWebsocket } = require('@ln-markets/api')
  const lnm = new LNMarketsWebsocket()
```

`LNMARKETS_API_VERSION` There is only one version aka `v1`

`LNMARKETS_API_HOSTNAME` is only used for debug

## Websocket API

> :warning: **Websocket API only support subscription**

Websockt API is limited now for bid offer and index update, we will make a dedicated Websocket api soon !

The message format is using [JSON-RPC](https://www.jsonrpc.org/specification) spec.

The websocket class has an auto ping-pong mechanism and reconnect

```JS
  const { LNMarketsWebsocket } = require('@ln-markets/api')
  const lnm = new LNMarketsWebsocket()
  lnm.on('message', console.log)
  await lnm.connect()
```

The `LNMarketsWebsocket` class emit events on `connected` `message` `error`

### Subscription

You can subscribe to LNM Markets public event such as futures bid offer, index and options data.

## Authentication

You need to call the `authenticate` method

### Examples

You can find examples for websocket [here](examples/websocket)

## REST API

All you have to do now is to instanciate a `LNMarketsRest` object this way:

```JS
  const { LNMarketsRest } = require('@ln-markets/api')
  const lnm = new LNMarketsRest()
  const info = await lnm.nodeState()
```

After this, you'll be able to use all the documented `API` methods below.

All these functions are wrappers for documented public endpoints from LN Markets API v1. See specification [here](https://docs.lnmarkets.com/api/v1/).

Be careful, all methods expect an object as parameter with the correct parameters in it.

### Examples

You can find examples for rest [here](examples/rest)

### Generic Methods

These methods are designed to fill the gaps if the API evolves and the future but this package isn't up to date.

- [`requestAPI`](#requestAPI)
- [`beforeRequestApi`](#beforeRequestApi)

### Methods

- [`futuresNewPosition`](#futuresNewPosition)
- [`futuresGetPositions`](#futuresGetPositions)
- [`futuresUpdatePosition`](#futuresUpdatePosition)
- [`futuresAddMarginPosition`](#futuresAddMarginPosition)
- [`futuresCancelAllPositions`](#futuresCancelAllPositions)
- [`futuresCancelPosition`](#futuresCancelPosition)
- [`futuresCashinPosition`](#futuresCashinPosition)
- [`futuresCloseAllPosisitions`](#futuresCloseAllPosisitions)
- [`futuresClosePosition`](#futuresClosePosition)
- [`futuresIndexHistory`](#futuresIndexHistory)
- [`futuresBidOfferHistory`](#futuresBidOfferHistory)
- [`futuresFixingHistory`](#futuresFixingHistory)
- [`futuresCarryFeesHistory`](#futuresCarryFeesHistory)
- [`deposit`](#deposit)
- [`depositHistory`](#depositHistory)
- [`futuresHistory`](#futuresHistory)
- [`getAnnouncements`](#getAnnouncements)
- [`getLeaderboard`](#getLeaderboard)
- [`getUser`](#getUser)
- [`apiState`](#apiState)
- [`nodeState`](#nodeState)
- [`updateUser`](#updateUser)
- [`withdraw`](#withdraw)
- [`withdrawHistory`](#withdrawHistory)

#### futuresNewPosition

Open a new position on the market.

```yaml
type:
  type: String
  required: true
  enum: ['l', 'm']

side:
  type: String
  required: true
  enum: ['b', 's']

margin:
  type: Integer
  required: false

leverage:
  type: Float
  required: true

quantity:
  type: Integer
  required: false

takeprofit:
  type: Integer
  required: false

stoploss:
  type: Integer
  required: false

price:
  type: Float
  required: false
```

Example:

```JS
  await lnm.futuresNewPosition({
    type: 'm',
    side: 's',
    margin: 10000,
    leverage: 25.5,
  })
```

[`POST /futures`](https://docs.lnmarkets.com/api/v1/#create) documentation for more details.

#### futuresGetPositions

Retrieve all or a part of user positions.

```yaml
type:
  type: String
  required: true
  enum: ['open', 'running', 'closed']
  default: 'open'

from:
  type: Integer
  required: false

to:
  type: Integer
  required: false

limit:
  type: Integer
  required: false
  default: 100
```

Example:

```JS
  await lnm.futuresGetPositions({
    type: 'running'
  })
```

[`GET /futures`](https://docs.lnmarkets.com/api/v1/#history) documentation for more details.

#### futuresUpdatePosition

Modify stoploss or takeprofit parameter of an existing position.

```yaml
pid:
  type: String
  required: true

type:
  type: String
  required: true
  enum: ['takeprofit', 'stoploss']

value:
  type: Float
  required: true
```

Example:

```JS
  await lnm.futuresUpdatePosition({
    pid: 'b87eef8a-52ab-2fea-1adc-c41fba870b0f',
    type: 'stoploss',
    value: 13290.5
  })
```

[`PUT /futures`](https://docs.lnmarkets.com/api/v1/#update) documentation for more details.

#### addMargin

Add more margin to an existing position.

```yaml
amount:
  type: Integer
  required: true
pid:
  type: String
  required: true
```

Example:

```JS
  await lnm.addMargin({
    amount: 20000,
    pid: '249dc818-f8a5-4713-a3a3-8fe85f2e8969'
  })
```

[`POST /futures/add-margin`](https://docs.lnmarkets.com/api/v1/#add-margin) documentation for more details.

#### futuresCancelAllPositions

Cancel all oponed (not running) positions for this user.

```yaml
# No parameters
```

Example:

```JS
  await lnm.futuresCancelAllPositions()
```

[`DELETE /futures/all/cancel`](https://docs.lnmarkets.com/api/v1/#cancel-all) documentation for more details.

#### futuresCancelPosition

Cancel a particular position for this user.

```yaml
pid:
  type: String
  required: true
```

Example:

```JS
  await lnm.futuresCancelPosition({
    pid: 'b87eef8a-52ab-2fea-1adc-c41fba870b0f'
  })
```

[`POST /futures/cancel`](https://docs.lnmarkets.com/api/v1/#cancel) documentation for more details.

#### futuresCashinPosition

Retrieve a part of the general PL of a running position.

```yaml
amount:
  type: Integer
  required: true
pid:
  type: String
  required: true
```

Example:

```JS
  await lnm.futuresCashinPosition({
    amount: 1000,
    pid: "99c470e1-2e03-4486-a37f-1255e08178b1"
  })
```

[`POST /futures/cash-in`](https://docs.lnmarkets.com/api/v1/#cancel) documentation for more details.

#### futuresCloseAllPosisitions

Close all running position for this user.

```yaml
# No parameters
```

Example:

```JS
  await lnm.futuresCloseAllPosisitions()
```

[`DELETE /futures/all/close`](https://docs.lnmarkets.com/api/v1/#cancel) documentation for more details.

#### futuresClosePosition

Close a particular running position for this user.

```yaml
pid:
  type: String
  required: true
```

Example:

```JS
  await lnm.futuresClosePosition({
    pid: 'a2ca6172-1078-463d-ae3f-8733f36a9b0e'
  })
```

[`DELETE /futures`](https://docs.lnmarkets.com/api/v1/#cancel) documentation for more details.

#### futuresIndexHistory

Get index history data.

```yaml
from:
  type: Integer
  required: false

to:
  type: Integer
  required: false

limit:
  type: Integer
  required: false
  default: 100
```

Example:

```JS
  await lnm.futuresIndexHistory({
    limit: 20
  })
```

[`GET /futures/history/index`](https://docs.lnmarkets.com/api/v1/#futures-index-history) documentation for more details.

#### futuresBidOfferHistory

Get bid and offer data over time.

```yaml
from:
  type: Integer
  required: false

to:
  type: Integer
  required: false

limit: Integer
  required: false
  default: 100
```

Example:

```JS
  await lnm.futuresBidOfferHistory({
    limit: 20
  })
```

[`GET /futures/history/bid-offer`](https://docs.lnmarkets.com/api/v1/#futures-bid-and-offer-history) documentation for more details.

#### futuresFixingHistory

Get fixing data history.

```yaml
from:
  type: Integer
  required: false

to:
  type: Integer
  required: false

limit:
  type: Integer
  required: false
  default: 100
```

Example:

```JS
  await lnm.futuresFixingHistory({
    limit: 20
  })
```

[`GET /futures/history/fixing`](https://docs.lnmarkets.com/api/v1/#futures-fixing-history) documentation for more details.

#### futuresCarryFeesHistory

Get carry-fees history.

```yaml
from:
  type: Integer
  required: false

to:
  type: Integer
  required: false

limit:
  type: Integer
  required: false
  default: 100
```

Example:

```JS
  await lnm.futuresCarryFeesHistory({
    limit: 20
  })
```

[`GET /futures/carry-fees`](https://docs.lnmarkets.com/api/v1/#futures-carry-fees-history) documentation for more details.

#### deposit

Add funds to your LN Markets balance.

```yaml
amount:
  type: Integer
  required: true
unit:
  type: String
  required: false
  default: 'sat'
```

Example:

```JS
  await lnm.deposit({
    amount: 25000
  })
```

[`POST /user/deposit`](https://docs.lnmarkets.com/api/v1/#deposit) documentation for more details.

#### depositHistory

Retrieve deposit history for this user.

```yaml
from:
  type: Integer
  required: false

to:
  type: Integer
  required: false

limit:
  type: Integer
  required: false
```

Example:

```JS
  await lnm.depositHistory({
    limit: 30
  })
```

[`GET /user/deposit`](https://docs.lnmarkets.com/api/v1/#deposit) documentation for more details.

#### getAnnouncements

Retrieve announcements made by LN Markets.

```yaml
# No parameters
```

Example:

```JS
  await lnm.getAnnouncements()
```

[`GET /state/announcemenets`](https://docs.lnmarkets.com/api/v1/#get-the-ln-markets-announcements) documentation for more details.

#### getLeaderboard

Queries the 10 users with the biggest positive PL.

```yaml
# No parameters
```

Example:

```JS
  await lnm.getLeaderboard()
```

[`GET /futures/leaderboard`](https://docs.lnmarkets.com/api/v1/#leaderboard) documentation for more details.

#### getUser

Retrieve user informations.

```yaml
# No parameters
```

Example:

```JS
  await lnm.getUser()
```

[`GET /user`](https://docs.lnmarkets.com/api/v1/#informations) documentation for more details.

#### apiState

Retrieve informations related to LN Markets lnm.

```yaml
# No parameters
```

Example:

```JS
  await lnm.apiState()
```

[`GET /state`](https://docs.lnmarkets.com/api/v1/#api-informations) documentation for more details.

#### nodeState

Show informations about LN Markets lightning node.

```yaml
# No parameters
```

Example:

```JS
  await lnm.nodeState()
```

[`GET /state/node`](https://docs.lnmarkets.com/api/v1/#node-informations) documentation for more details.

#### updateUser

Modify user account parameters.

```yaml
show_leaderboard:
  type: Boolean
  required: false

show_username:
  type: Boolean
  required: false

username:
  type: String
  required: false

email:
  type: String
  required: false

resend_email:
  type: Boolean
  required: false
```

Example:

```JS
  await lnm.updateUser({
    show_username: true,
    show_leaderboard: true,
    username: 'API-Connector',
  })
```

[`PUT /user`](https://docs.lnmarkets.com/api/v1/#update-user) documentation for more details.

#### withdraw

Move funds from LN Markets to your wallet via BOLT11 invoice.

```yaml
amount:
  type: Integer
  required: true

unit:
  type: String
  required: false
  default: 'sat'

invoice:
  type: String
  required: true
```

Example:

```JS
  await lnm.withdraw({
    amount: 1000,
    invoice: 'lntb100u1p0jr0ykpp5ldx3un8ym6z0uwjxd083mp2rcr04d2dv0fkx729ajs62pq9pfjqqdql23jhxapdwa5hg6rywfshwttjda6hgegcqzpgxq92fjuqsp5m6q0fzynu2qr624mzjc285duurhccmkfg94mcdctc0p9s7qkrq8q9qy9qsqp862cjznpey5r76e7amhlpmhwn2c7xvke59srhv0xf75m4ksjm4hzn8y9xy0zs5ec6gxmsr8gj4q23w8ped32llscjcneyjz2afeapqpu4gamz'
  })
```

[`POST /user/withdraw`](https://docs.lnmarkets.com/api/v1/#withdraw-via-invoice) documentation for more details.

#### withdrawHistory

Retrieve user withdraw history.

```yaml
from:
  type: Integer
  required: false

to:
  type: Integer
  required: false

limit:
  type: Integer
  required: false
```

Example:

```JS
  await lnm.withdrawHistory({
    limit: 25
  })
```

[`GET /user/withdraw`](https://docs.lnmarkets.com/api/v1/#withdraw) documentation for more details.

#### requestAPI

This method is used in case where no wrapper is (yet) available for a particular endpoint.

```yaml
method:
  type: String
  required: true
  enum: ['GET', 'PUT', 'POST', 'DELETE']

path:
  type: String
  required: true

params:
  type: Object
  required: false

credentials:
  type: Boolean
  required: false
  default: false
```

Example:

```JS
  await lnm.requestAPI({
    method: 'GET',
    path: '/user',
    credentials: true
  })
```
