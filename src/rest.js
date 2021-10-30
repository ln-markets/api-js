const https = require('https')
const { URLSearchParams } = require('url')

const getHostname = (network = null) => {
  // If this en var is set overide LNMARKETS_API_NETWORK
  if (process.env.LNMARKETS_API_HOSTNAME) {
    return process.env.LNMARKETS_API_HOSTNAME
  } else if (network === 'mainnet') {
    return 'api.lnmarkets.com'
  } else if (network === 'testnet') {
    return 'api.testnet.lnmarkets.com'
  }
  return 'api.lnmarkets.com'
}

const RestError = class RestError extends Error {
  constructor(statusCode, data) {
    if (typeof data === 'object') {
      const { code, message } = data
      super(message)
      this.name = 'LNMarketsRestError'
      this.statusCode = statusCode
      this.code = code
      this.message = message
    } else {
      super(data)

      this.name = 'LNMarketsRestError'
      this.statusCode = statusCode
      this.message = data
    }
  }
}

module.exports = class LNMarketsRest {
  constructor(opt = {}) {
    const { token, network, version, customHeaders, fullResponse } = opt

    this.token = token
    this.network = network || process.env.LNMARKETS_API_NETWORK || 'mainnet'
    this.version = version || process.env.LNMARKETS_API_VERSION || 'v1'
    this.hostname = getHostname(this.network)
    this.customHeaders = customHeaders || {}
    this.fullResponse = false || fullResponse
    this.debug = false || opt.debug
  }

  _requestOptions(opt = {}) {
    const { method, endpoint, params, credentials } = opt

    const headers = {
      'Content-Type': 'application/json',
      ...this.customHeaders,
    }

    const options = {
      port: 443,
      hostname: this.hostname,
      method,
      path: `/${this.version}${endpoint}`,
      headers,
    }

    if (credentials && this.token) {
      options.headers.Authorization = `Bearer ${this.token}`
    }

    if (method.match(/^(GET|DELETE)$/) && params) {
      options.path += `?${new URLSearchParams(params).toString()}`
    }

    return options
  }

  requestAPI(opt = {}) {
    const options = this._requestOptions(opt)

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        res.setEncoding('utf8')

        let data = ''

        res.on('data', (chunk) => {
          data += chunk
        })

        res.on('error', (error) => {
          reject(error)
        })

        res.on('end', () => {
          if (this.debug) {
            return resolve({ req, res })
          }

          try {
            const body = JSON.parse(data)

            if (res.statusCode === 200) {
              if (this.fullResponse) {
                const { statusCode, headers } = res
                resolve({ body, statusCode, headers })
              } else {
                resolve(body)
              }
            } else {
              reject(new RestError(res.statusCode, body))
            }
          } catch (error) {
            error.data = data
            reject(error)
          }
        })
      })

      req.on('error', (error) => {
        reject(error)
      })

      if (options.method.match(/^(PUT|POST)$/) && opt.params) {
        req.write(JSON.stringify(opt.params))
      }

      req.end()
    })
  }

  // Hook to do stuff before sending a request ...
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
