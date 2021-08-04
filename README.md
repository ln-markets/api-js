# Node Connector

## Install
You can install this package with npm:

```shell
  $> npm install @lnmarkets/api
```

Then go to on your LN Markets account under the API section of the Profile to generate an API Token with the right scopes and the right expiry to fit your needs. You'll need to copy this token as it is needed to authenticate yourself and make requests to the API.

![Generate Token](https://i.postimg.cc/cJWXkCrj/Untitled.png)

All you have to do now is to instanciate a `LNMarkets` object this way:

```JS
  const LNMarkets = require('@lnmarkets/api')
  const API = new LNMarkets({ token: <YOUR-TOKEN> })
```

After this, you'll be able to use all the documented `API` methods below.

## Options

This connector require an object as parameter. Here is the list of its possible properties.

```yaml
  token:
    type: String
    required: true

  network:
    type: String
    required: false
    default: 'mainnet'

  version:
    type: String
    required: false
    default: 'v1'
```

## Route Methods

All these functions are wrappers for documented public endpoints from LN Markets API v1. See specification [here](https://docs.lnmarkets.com/api/v1/).

Be careful, all methods expect an object as parameter with the correct parameters in it.

* [`addMarginPosition`](#addMarginPosition)
* [`apiState`](#apiState)
* [`cancelAllPositions`](#cancelAllPositions)
* [`cancelPosition`](#cancelPosition)
* [`cashinPosition`](#cashinPosition)
* [`closeAllPosisitions`](#closeAllPosisitions)
* [`closePosition`](#closePosition)
* [`deposit`](#deposit)
* [`depositHistory`](#depositHistory)
* [`futuresDataHistory`](#futuresDataHistory)
* [`getAnnouncements`](#getAnnouncements)
* [`getLeaderboard`](#getLeaderboard)
* [`getPositions`](#getPositions)
* [`getUser`](#getUser)
* [`newPosition`](#newPosition)
* [`nodeState`](#nodeState)
* [`updatePosition`](#updatePosition)
* [`updateUser`](#updateUser)
* [`withdraw`](#withdraw)
* [`withdrawHistory`](#withdrawHistory)
* [`withdrawLNURL`](#withdrawLNURL)

## Generic Methods

These methods are designed to fill the gaps if the API evolves and the future but this package isn't up to date.

* [`requestAPI`](#requestAPI)

## Documentation
### addMargin

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
  await API.addMargin({
    amount: 20000,
    pid: '249dc818-f8a5-4713-a3a3-8fe85f2e8969'
  })
```

[`POST /futures/add-margin`](https://docs.lnmarkets.com/api/v1/#add-margin) documentation for more details.

### apiState

Retrieve informations related to LN Markets API.

```yaml
  # No parameters
```

Example:

```JS
  await API.apiState()
```

[`GET /state`](https://docs.lnmarkets.com/api/v1/#api-informations) documentation for more details.

### cancelAllPositions

Cancel all oponed (not running) positions for this user.

```yaml
  # No parameters
```

Example:

```JS
  await API.cancelAllPositions()
```

[`DELETE /futures/all/cancel`](https://docs.lnmarkets.com/api/v1/#cancel-all) documentation for more details.


### cancelPosition

Cancel a particular position for this user.

```yaml
  pid:
    type: String
    required: true
```

Example:

```JS
  await API.cancelPosition({
    pid: 'b87eef8a-52ab-2fea-1adc-c41fba870b0f'
  })
```

[`POST /futures/cancel`](https://docs.lnmarkets.com/api/v1/#cancel) documentation for more details.

### cashinPosition

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
  await API.cashinPosition({
    amount: 1000,
    pid: "99c470e1-2e03-4486-a37f-1255e08178b1"
  })
```

[`POST /futures/cash-in`](https://docs.lnmarkets.com/api/v1/#cancel) documentation for more details.

### closeAllPosisitions

Close all running position for this user.

```yaml
  # No parameters
```

Example:

```JS
  await API.closeAllPosisitions()
```

[`DELETE /futures/all/close`](https://docs.lnmarkets.com/api/v1/#cancel) documentation for more details.

### closePosition

Close a particular running position for this user.

```yaml
  pid:
    type: String
    required: true
```

Example:

```JS
  await API.closePosition({
    pid: 'a2ca6172-1078-463d-ae3f-8733f36a9b0e'
  })
```

[`DELETE /futures`](https://docs.lnmarkets.com/api/v1/#cancel) documentation for more details.

### deposit

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
  await API.deposit({
    amount: 25000
  })
```

[`POST /user/deposit`](https://docs.lnmarkets.com/api/v1/#deposit) documentation for more details.

### depositHistory

Retrieve deposit history for this user.

```yaml
  nbItem:
    type: Integer
    required: false
    default: 50
  index:
    type: Integer
    required: false
    default: 0
  getLength:
    type: Boolean
    required: false
    default: false
  start:
    type: Integer
    required: false
  end:
    type: Integer
    required: false
```

Example:

```JS
  await API.depositHistory({
    nbItem: 30
  })
```

[`GET /user/deposit`](https://docs.lnmarkets.com/api/v1/#deposit) documentation for more details.

### futuresDataHistory

Retrieve the past bid, offer and index data recorded.

```yaml
  table:
    type: String
    required: true
    enum: ['bid_offer', 'index']
  from:
    type: Integer
    required: false
  to:
    type: Integer
    required: false
  limit:
    type: Integer
    required: false
    default: 1000
```

Example:

```JS
  await API.futuresDataHistory({
    table: 'index',
    limit: 250
  })
```

[`GET /futures/history`](https://docs.lnmarkets.com/api/v1/#futures-data-history) documentation for more details.

### getAnnouncements

Retrieve announcements made by LN Markets.

```yaml
  # No parameters
```

Example:

```JS
  await API.getAnnouncements()
```

[`GET /state/announcemenets`](https://docs.lnmarkets.com/api/v1/#get-the-ln-markets-announcements) documentation for more details.

### getLeaderboard

Queries the 10 users with the biggest positive PL.

```yaml
  # No parameters
```

Example:

```JS
  await API.getLeaderboard()
```

[`GET /state/leaderboard`](https://docs.lnmarkets.com/api/v1/#api-leaderboard) documentation for more details.

### getPositions

Retrieve all or a part of user positions.

```yaml
  type:
    type: String
    required: false
    enum: ['all', 'open', 'running', 'closed']
    default: 'all'
```

Example:

```JS
  await API.getPositions({
    type: 'running'
  })
```

[`GET /futures`](https://docs.lnmarkets.com/api/v1/#history) documentation for more details.

### getUser

Retrieve user informations.

```yaml
  # No parameters
```

Example:

```JS
  await API.getUser()
```

[`GET /user`](https://docs.lnmarkets.com/api/v1/#informations) documentation for more details.

### newPosition

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
  await API.newPosition({
    type: 'm',
    side: 's',
    margin: 10000,
    leverage: 25.5,
  })
```

[`POST /futures`](https://docs.lnmarkets.com/api/v1/#create) documentation for more details.

### nodeState

Show informations about LN Markets lightning node.

```yaml
  # No parameters
```

Example:

```JS
  await API.nodeState()
```

[`GET /state/node`](https://docs.lnmarkets.com/api/v1/#node-informations) documentation for more details.

### updatePosition

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
  await API.updatePosition({
    pid: 'b87eef8a-52ab-2fea-1adc-c41fba870b0f',
    type: 'stoploss',
    value: 13290.5
  })
```

[`PUT /futures`](https://docs.lnmarkets.com/api/v1/#update) documentation for more details.

### updateUser

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
  await API.updateUser({
    show_username: true,
    show_leaderboard: true,
    username: 'API-Connector',
  })
```

[`PUT /user`](https://docs.lnmarkets.com/api/v1/#update-user) documentation for more details.



### withdraw

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
  await API.withdraw({
    amount: 1000,
    invoice: 'lntb100u1p0jr0ykpp5ldx3un8ym6z0uwjxd083mp2rcr04d2dv0fkx729ajs62pq9pfjqqdql23jhxapdwa5hg6rywfshwttjda6hgegcqzpgxq92fjuqsp5m6q0fzynu2qr624mzjc285duurhccmkfg94mcdctc0p9s7qkrq8q9qy9qsqp862cjznpey5r76e7amhlpmhwn2c7xvke59srhv0xf75m4ksjm4hzn8y9xy0zs5ec6gxmsr8gj4q23w8ped32llscjcneyjz2afeapqpu4gamz'
  })
```

[`POST /user/withdraw`](https://docs.lnmarkets.com/api/v1/#withdraw-via-invoice) documentation for more details.

### withdrawHistory

Retrieve user withdraw history.

```yaml
  nbItem:
    type: Integer
    required: false
    default: 50
  index:
    type: Integer
    required: false
    default: 0
  getLength:
    type: Boolean
    required: false
    default: false
  start:
    type: Integer
    required: false
  end:
    type: Integer
    required: false
```

Example:

```JS
  await API.withdrawHistory({
    nbItem: 25
  })
```

[`GET /user/withdraw`](https://docs.lnmarkets.com/api/v1/#withdraw) documentation for more details.


### withdrawLNURL

Create a LNURL to withdraw from user account.

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
  await API.withdrawLNURL({
    amount: 40000,
  })
```

[`POST /lnurl/withdraw`](https://docs.lnmarkets.com/api/v1/#create-a-lnurl-withdraw) documentation for more details.
Use LNURL to withdraw directly from the user balance to the wallet

### requestAPI

This method is used in case where no wrapper is (yet) available for a particular endpoint.

```yaml
  method:
    type: String
    required: true
    enum: ['GET', 'PUT', 'POST', 'DELETE']
  
  endpoint:
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

`endpoint` is which route you want to communicate with, `credentials` is your generated token.

Example:

```JS
  await API.requestAPI({
    method: 'GET',
    endpoint: '/user',
    credentials: true
  })
```
