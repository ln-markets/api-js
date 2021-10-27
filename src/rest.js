const https = require('https')
const { URLSearchParams } = require('url')

const getHostname = (network = null) => {
  if (process.env.LNMARKETS_API_URL) {
    return process.env.LNMARKETS_API_URL
  } else if (network === 'mainnet') {
    return 'api.lnmarkets.com'
  } else if (network === 'testnet') {
    return 'api.testnet.lnmarkets.com'
  }
  return 'api.lnmarkets.com'
}

const RestError = class RestError extends Error {
  constructor(status, message) {
    if (!status) throw new Error('An HTTP Error need a status')

    super(message)

    this.name = 'RestError'
    this.status = status
    this.message = message
  }
}

module.exports = class LNMarketsRest {
  constructor(opt = {}) {
    const { token, network, version } = opt

    this.token = token
    this.network = network || process.env.LNMARKETS_NETWORK || 'mainnet'
    this.version = version || process.env.LNMARKETS_API_VERSION || 'v1'
    this.hostname = getHostname(this.network)
  }

  requestAPI(opt = {}) {
    const { method, endpoint, params, credentials } = opt
    const { hostname, version, token } = this

    const options = {
      port: 443,
      hostname,
      method,
      path: `/${version}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    if (credentials && token) {
      options.headers.Authorization = `Bearer ${token}`
    }

    if (method.match(/^(GET|DELETE)$/) && params) {
      options.path += `?${new URLSearchParams(params).toString()}`
    }

    return new Promise((resolve, reject) => {
      const call = https.request(options, (response) => {
        let data = ''

        response.on('data', (chunk) => {
          data += chunk
        })

        response.on('error', (error) => {
          reject(error)
        })

        response.on('end', () => {
          try {
            const body = JSON.parse(data)

            if (response.statusCode === 200) {
              resolve(body)
            } else {
              reject(new RestError(response.statusCode, body))
            }
          } catch (error) {
            error.data = data
            reject(error)
          }
        })
      })

      call.on('error', (error) => {
        reject(error)
      })

      if (method.match(/^(PUT|POST)$/) && params) {
        call.write(JSON.stringify(params))
      }

      call.end()
    })
  }

  beforeRequestApi(options) {
    return this.requestAPI(options)
  }

  futuresNewPosition(params) {
    const options = {
      method: 'POST',
      endpoint: '/futures',
      params,
      credentials: true,
    }

    return this.beforeRequestApi(options)
  }

  futuresUpdatePosition(params) {
    const options = {
      method: 'PUT',
      endpoint: '/futures',
      params,
      credentials: true,
    }

    return this.beforeRequestApi(options)
  }

  futuresClosePosition(params) {
    const options = {
      method: 'DELETE',
      endpoint: '/futures',
      params,
      credentials: true,
    }

    return this.beforeRequestApi(options)
  }

  futuresCloseAllPositions() {
    const options = {
      method: 'DELETE',
      endpoint: '/futures/all/close',
      credentials: true,
    }

    return this.beforeRequestApi(options)
  }

  futuresCancelPosition(params) {
    const options = {
      method: 'POST',
      endpoint: '/futures/cancel',
      params,
      credentials: true,
    }

    return this.beforeRequestApi(options)
  }

  futuresCancelAllPositions() {
    const options = {
      method: 'DELETE',
      endpoint: '/futures/all/cancel',
      credentials: true,
    }

    return this.beforeRequestApi(options)
  }

  futuresCashinPosition(params) {
    const options = {
      method: 'POST',
      endpoint: '/futures/cash-in',
      params,
      credentials: true,
    }

    return this.beforeRequestApi(options)
  }

  futuresAddMarginPosition(params) {
    const options = {
      method: 'POST',
      endpoint: '/futures/add-margin',
      params,
      credentials: true,
    }

    return this.beforeRequestApi(options)
  }

  futuresGetPositions(params) {
    const options = {
      method: 'GET',
      endpoint: '/futures',
      params,
      credentials: true,
    }

    return this.beforeRequestApi(options)
  }

  futuresBidOfferHistory(params) {
    const options = {
      method: 'GET',
      endpoint: '/futures/history/bid-offer',
      params,
    }

    return this.beforeRequestApi(options)
  }

  futuresIndexHistory(params) {
    const options = {
      method: 'GET',
      endpoint: '/futures/history/index',
      params,
    }

    return this.beforeRequestApi(options)
  }

  futuresFixingHistory(params) {
    const options = {
      method: 'GET',
      endpoint: '/futures/history/fixing',
      params,
    }

    return this.beforeRequestApi(options)
  }

  futuresCarryFeesHistory(params) {
    const options = {
      method: 'GET',
      endpoint: '/futures/carry-fees',
      params,
    }

    return this.beforeRequestApi(options)
  }

  getUser() {
    const options = {
      method: 'GET',
      endpoint: '/user',
      credentials: true,
    }

    return this.beforeRequestApi(options)
  }

  updateUser(params) {
    const options = {
      method: 'PUT',
      endpoint: '/user',
      params,
      credentials: true,
    }

    return this.beforeRequestApi(options)
  }

  deposit(params) {
    const options = {
      method: 'POST',
      endpoint: '/user/deposit',
      params,
      credentials: true,
    }

    return this.beforeRequestApi(options)
  }

  depositHistory(params) {
    const options = {
      method: 'GET',
      endpoint: '/user/deposit',
      params,
      credentials: true,
    }

    return this.beforeRequestApi(options)
  }

  withdraw(params) {
    const options = {
      method: 'POST',
      endpoint: '/user/withdraw',
      params,
      credentials: true,
    }

    return this.beforeRequestApi(options)
  }

  withdrawHistory(params) {
    const options = {
      method: 'GET',
      endpoint: '/user/withdraw',
      params,
      credentials: true,
    }

    return this.beforeRequestApi(options)
  }

  apiState() {
    const options = {
      method: 'GET',
      endpoint: '/state',
    }

    return this.beforeRequestApi(options)
  }

  nodeState() {
    const options = {
      method: 'GET',
      endpoint: '/state/node',
    }

    return this.beforeRequestApi(options)
  }

  getLeaderboard() {
    const options = {
      method: 'GET',
      endpoint: '/futures/leaderboard',
    }

    return this.beforeRequestApi(options)
  }

  getAnnouncements() {
    const options = {
      method: 'GET',
      endpoint: '/state/announcements',
    }

    return this.beforeRequestApi(options)
  }

  getLnurlAuth() {
    const options = {
      method: 'POST',
      endpoint: '/lnurl/auth',
    }

    return this.beforeRequestApi(options)
  }

  lnurlAuth(params) {
    const options = {
      method: 'GET',
      endpoint: '/lnurl/auth',
      params,
    }

    return this.beforeRequestApi(options)
  }
}
