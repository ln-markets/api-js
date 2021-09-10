const https = require('https')
const querystring = require('querystring')

module.exports = class LNMarketsHttp {
  constructor(opt = {}) {
    const { token, network, version } = opt

    this.token = token
    this.network = network || 'mainnet'
    this.version = version || 'v1'
    this.hostname =
      this.network === 'mainnet'
        ? 'api.lnmarkets.com'
        : 'api.testnet.lnmarkets.com'
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

    if (credentials) {
      options.headers.Authorization = `Bearer ${token}`
    }

    if (method.match(/^(GET|DELETE)$/) && params) {
      options.path += `?${querystring.stringify(params)}`
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
              reject({ body, statusCode: response.statusCode })
            }
          } catch (error) {
            error.data = data
            reject(error)
          }
        })
      })

      if (method.match(/^(PUT|POST)$/) && params) {
        call.write(JSON.stringify(params))
      }

      call.end()
    })
  }

  futuresNewPosition(params) {
    const options = {
      method: 'POST',
      endpoint: '/futures',
      params,
      credentials: true,
    }

    return this.requestAPI(options)
  }

  futuresUpdatePosition(params) {
    const options = {
      method: 'PUT',
      endpoint: '/futures',
      params,
      credentials: true,
    }

    return this.requestAPI(options)
  }

  futuresClosePosition(params) {
    const options = {
      method: 'DELETE',
      endpoint: '/futures',
      params,
      credentials: true,
    }

    return this.requestAPI(options)
  }

  futuresCloseAllPositions() {
    const options = {
      method: 'DELETE',
      endpoint: '/futures/all/close',
      credentials: true,
    }

    return this.requestAPI(options)
  }

  futuresCancelPosition(params) {
    const options = {
      method: 'POST',
      endpoint: '/futures/cancel',
      params,
      credentials: true,
    }

    return this.requestAPI(options)
  }

  futuresCancelAllPositions() {
    const options = {
      method: 'DELETE',
      endpoint: '/futures/all/cancel',
      credentials: true,
    }

    return this.requestAPI(options)
  }

  futuresCashinPosition(params) {
    const options = {
      method: 'POST',
      endpoint: '/futures/cash-in',
      params,
      credentials: true,
    }

    return this.requestAPI(options)
  }

  futuresAddMarginPosition(params) {
    const options = {
      method: 'POST',
      endpoint: '/futures/add-margin',
      params,
      credentials: true,
    }

    return this.requestAPI(options)
  }

  futuresGetPositions(params) {
    const options = {
      method: 'GET',
      endpoint: '/futures',
      params,
      credentials: true,
    }

    return this.requestAPI(options)
  }

  futuresBidOfferHistory(params) {
    const options = {
      method: 'GET',
      endpoint: '/futures/history/bid-offer',
      params,
    }

    return this.requestAPI(options)
  }

  futuresIndexHistory(params) {
    const options = {
      method: 'GET',
      endpoint: '/futures/history/index',
      params,
    }

    return this.requestAPI(options)
  }


  futuresFixingHistory(params) {
    const options = {
      method: 'GET',
      endpoint: '/futures/history/fixing',
      params,
    }

    return this.requestAPI(options)
  }

  futuresCarryFees(params) {
    const options = {
      method: 'GET',
      endpoint: '/futures/carry-fees',
      params,
    }

    return this.requestAPI(options)
  }


  getUser() {
    const options = {
      method: 'GET',
      endpoint: '/user',
      credentials: true,
    }

    return this.requestAPI(options)
  }

  updateUser(params) {
    const options = {
      method: 'PUT',
      endpoint: '/user',
      params,
      credentials: true,
    }

    return this.requestAPI(options)
  }

  deposit(params) {
    const options = {
      method: 'POST',
      endpoint: '/user/deposit',
      params,
      credentials: true,
    }

    return this.requestAPI(options)
  }

  depositHistory(params) {
    const options = {
      method: 'GET',
      endpoint: '/user/deposit',
      params,
      credentials: true,
    }

    return this.requestAPI(options)
  }

  withdraw(params) {
    const options = {
      method: 'POST',
      endpoint: '/user/withdraw',
      params,
      credentials: true,
    }

    return this.requestAPI(options)
  }

  withdrawLNURL(params) {
    const options = {
      method: 'POST',
      endpoint: '/lnurl/withdraw',
      params,
      credentials: true,
    }

    return this.requestAPI(options)
  }

  withdrawHistory(params) {
    const options = {
      method: 'GET',
      endpoint: '/user/withdraw',
      params,
      credentials: true,
    }

    return this.requestAPI(options)
  }

  apiState() {
    const options = {
      method: 'GET',
      endpoint: '/state',
    }

    return this.requestAPI(options)
  }

  nodeState() {
    const options = {
      method: 'GET',
      endpoint: '/state/node',
    }

    return this.requestAPI(options)
  }

  getLeaderboard() {
    const options = {
      method: 'GET',
      endpoint: '/futures/leaderboard',
    }

    return this.requestAPI(options)
  }

  getAnnouncements() {
    const options = {
      method: 'GET',
      endpoint: '/state/announcements',
    }

    return this.requestAPI(options)
  }
}
