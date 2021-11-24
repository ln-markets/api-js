const https = require('https')
const { createHmac } = require('crypto')
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

  // Default to mainnet
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
    const {
      key,
      secret,
      network,
      version,
      customHeaders,
      fullResponse,
      passphrase,
      skipApiKey,
      debug,
    } = opt

    this.key = key || process.env.LNMARKETS_API_KEY
    this.secret = secret || process.env.LNMARKETS_API_SECRET
    this.passphrase = passphrase || process.env.LNMARKETS_API_PASSPHRASE
    this.network = network || process.env.LNMARKETS_API_NETWORK || 'mainnet'
    this.version = version || process.env.LNMARKETS_API_VERSION || 'v1'
    this.hostname = getHostname(this.network)
    this.customHeaders = customHeaders || {}
    this.fullResponse = false || fullResponse
    this.debug = false || debug
    this.skipApiKey = false || skipApiKey
  }

  _requestOptions(opt = {}) {
    const { method, path, params, credentials, headers = {} } = opt

    Object.assign(headers, {
      'Content-Type': 'application/json',
      ...this.customHeaders,
    })

    if (credentials && !this.skipApiKey) {
      if (!this.key) {
        throw new Error('You need an API key to use an authenticated route')
      } else if (!this.secret) {
        throw new Error('You need an API secret to use an authenticated route')
      } else if (!this.passphrase) {
        throw new Error(
          'You need an API passphrase to use an authenticated route'
        )
      }

      const timestamp = Date.now()

      let data

      if (method.match(/^(GET|DELETE)$/) && params) {
        data = `${params ? new URLSearchParams(params).toString() : ''}`
      } else {
        data = `${params ? JSON.stringify(params) : ''}`
      }

      const signature = createHmac('sha256', this.secret)
        .update(`${timestamp}${method}/${this.version}${path}${data}`)
        .digest('base64')

      Object.assign(headers, {
        'LNM-ACCESS-KEY': this.key,
        'LNM-ACCESS-PASSPHRASE': this.passphrase,
        'LNM-ACCESS-TIMESTAMP': timestamp,
        'LNM-ACCESS-SIGNATURE': signature,
      })
    }

    const options = {
      port: 443,
      hostname: this.hostname,
      path: `/${this.version}${path}`,
      method,
      headers,
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
      path: '/futures',
      params,
      credentials: true,
    }

    return this.beforeRequestApi(options)
  }

  futuresUpdatePosition(params) {
    const options = {
      method: 'PUT',
      path: '/futures',
      params,
      credentials: true,
    }

    return this.beforeRequestApi(options)
  }

  futuresClosePosition(params) {
    const options = {
      method: 'DELETE',
      path: '/futures',
      params,
      credentials: true,
    }

    return this.beforeRequestApi(options)
  }

  futuresCloseAllPositions() {
    const options = {
      method: 'DELETE',
      path: '/futures/all/close',
      credentials: true,
    }

    return this.beforeRequestApi(options)
  }

  futuresCancelPosition(params) {
    const options = {
      method: 'POST',
      path: '/futures/cancel',
      params,
      credentials: true,
    }

    return this.beforeRequestApi(options)
  }

  futuresCancelAllPositions() {
    const options = {
      method: 'DELETE',
      path: '/futures/all/cancel',
      credentials: true,
    }

    return this.beforeRequestApi(options)
  }

  futuresCashinPosition(params) {
    const options = {
      method: 'POST',
      path: '/futures/cash-in',
      params,
      credentials: true,
    }

    return this.beforeRequestApi(options)
  }

  futuresAddMarginPosition(params) {
    const options = {
      method: 'POST',
      path: '/futures/add-margin',
      params,
      credentials: true,
    }

    return this.beforeRequestApi(options)
  }

  futuresGetPositions(params) {
    const options = {
      method: 'GET',
      path: '/futures',
      params,
      credentials: true,
    }

    return this.beforeRequestApi(options)
  }

  futuresBidOfferHistory(params) {
    const options = {
      method: 'GET',
      path: '/futures/history/bid-offer',
      params,
    }

    return this.beforeRequestApi(options)
  }

  futuresIndexHistory(params) {
    const options = {
      method: 'GET',
      path: '/futures/history/index',
      params,
    }

    return this.beforeRequestApi(options)
  }

  futuresFixingHistory(params) {
    const options = {
      method: 'GET',
      path: '/futures/history/fixing',
      params,
    }

    return this.beforeRequestApi(options)
  }

  futuresCarryFeesHistory(params) {
    const options = {
      method: 'GET',
      path: '/futures/carry-fees',
      params,
    }

    return this.beforeRequestApi(options)
  }

  getUser() {
    const options = {
      method: 'GET',
      path: '/user',
      credentials: true,
    }

    return this.beforeRequestApi(options)
  }

  updateUser(params) {
    const options = {
      method: 'PUT',
      path: '/user',
      params,
      credentials: true,
    }

    return this.beforeRequestApi(options)
  }

  deposit(params) {
    const options = {
      method: 'POST',
      path: '/user/deposit',
      params,
      credentials: true,
    }

    return this.beforeRequestApi(options)
  }

  depositHistory(params) {
    const options = {
      method: 'GET',
      path: '/user/deposit',
      params,
      credentials: true,
    }

    return this.beforeRequestApi(options)
  }

  withdraw(params) {
    const options = {
      method: 'POST',
      path: '/user/withdraw',
      params,
      credentials: true,
    }

    return this.beforeRequestApi(options)
  }

  withdrawHistory(params) {
    const options = {
      method: 'GET',
      path: '/user/withdraw',
      params,
      credentials: true,
    }

    return this.beforeRequestApi(options)
  }

  apiState() {
    const options = {
      method: 'GET',
      path: '/state',
    }

    return this.beforeRequestApi(options)
  }

  nodeState() {
    const options = {
      method: 'GET',
      path: '/state/node',
    }

    return this.beforeRequestApi(options)
  }

  getLeaderboard() {
    const options = {
      method: 'GET',
      path: '/futures/leaderboard',
    }

    return this.beforeRequestApi(options)
  }

  getAnnouncements() {
    const options = {
      method: 'GET',
      path: '/state/announcements',
    }

    return this.beforeRequestApi(options)
  }

  getLnurlAuth() {
    const options = {
      method: 'POST',
      path: '/lnurl/auth',
    }

    return this.beforeRequestApi(options)
  }

  lnurlAuth(params) {
    const options = {
      method: 'GET',
      path: '/lnurl/auth',
      params,
    }

    return this.beforeRequestApi(options)
  }
}
