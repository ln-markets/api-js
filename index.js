const https = require('https')
const querystring = require('querystring')

module.exports = class LNMarkets {
  constructor({ token, network, version }) {
    this.token = token
    this.network = network || 'mainnet'
    this.version = version || 'v1'
    this.hostname =
      network === 'mainnet' ? 'api.lnmarkets.com' : 'api.testnet.lnmarkets.com'
  }

  requestAPI({ method, endpoint, params, credentials }) {
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
        let body = ''

        response.on('data', (chunk) => {
          body += chunk
        })

        response.on('error', (error) => {
          reject(error)
        })

        response.on('end', () => {
          const data = JSON.parse(body)

          if (response.statusCode === 200) {
            resolve({ body: data, statusCode: response.statusCode })
          } else {
            resolve({ body: data, statusCode: response.statusCode })
          }
        })
      })

      if (method.match(/^(PUT|POST)$/) && params) {
        call.write(JSON.stringify(params))
      }

      call.end()
    })
  }

  newPosition(params) {
    const options = {
      method: 'POST',
      endpoint: '/futures',
      params,
      credentials: true,
    }

    return this.requestAPI(options)
  }

  updatePosition(params) {
    const options = {
      method: 'PUT',
      endpoint: '/futures',
      params,
      credentials: true,
    }

    return this.requestAPI(options)
  }

  closePosition(params) {
    const options = {
      method: 'DELETE',
      endpoint: '/futures',
      params,
      credentials: true,
    }

    return this.requestAPI(options)
  }

  closeAllPositions() {
    const options = {
      method: 'DELETE',
      endpoint: '/futures/all/close',
      credentials: true,
    }

    return this.requestAPI(options)
  }

  cancelPosition(params) {
    const options = {
      method: 'POST',
      endpoint: '/futures/cancel',
      params,
      credentials: true,
    }

    return this.requestAPI(options)
  }

  cancelAllPositions() {
    const options = {
      method: 'DELETE',
      endpoint: '/futures/all/cancel',
      credentials: true,
    }

    return this.requestAPI(options)
  }

  cashinPosition(params) {
    const options = {
      method: 'POST',
      endpoint: '/futures/cash-in',
      params,
      credentials: true,
    }

    return this.requestAPI(options)
  }

  addMarginPosition(params) {
    const options = {
      method: 'POST',
      endpoint: '/futures/add-margin',
      params,
      credentials: true,
    }

    return this.requestAPI(options)
  }

  getPositions(params) {
    const options = {
      method: 'GET',
      endpoint: '/futures',
      params,
      credentials: true,
    }

    return this.requestAPI(options)
  }

  futuresDataHistory(params) {
    const options = {
      method: 'GET',
      endpoint: '/futures/history',
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
      endpoint: '/state/leaderboard',
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
