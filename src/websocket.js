const WebsocketClient = require('./websocket-client.js')
const EventEmitter = require('eventemitter3')
const { randomBytes, createHmac } = require('crypto')

const getHostname = (network = null) => {
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

module.exports = class LNMarketsWebsocket extends EventEmitter {
  constructor(opt = {}) {
    super()
    const {
      network,
      version,
      key,
      secret,
      passphrase,
      clientOptions = {},
    } = opt

    this.ws = undefined
    this.clientOptions = clientOptions
    this.key = key || process.env.LNMARKETS_API_KEY
    this.secret = secret || process.env.LNMARKETS_API_SECRET
    this.passphrase = passphrase || process.env.LNMARKETS_API_PASSPHRASE
    this.network = network || process.env.LNMARKETS_API_NETWORK || 'mainnet'
    this.version = version || process.env.LNMARKETS_API_VERSION || 'v1'
    this.hostname = getHostname(this.network)
    this.connected = false
  }

  connect() {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebsocketClient({
          ...this.clientOptions,
          url: `wss://${this.hostname}`,
        })

        this.ws.onOpen = () => {
          this.emit('connected')
          this.connected = true
          resolve()
        }

        this.ws.onMessage = this.onMessage.bind(this)
        this.ws.onError = this.onError.bind(this)

        this.ws.connect()
      } catch (error) {
        reject(error)
      }
    })
  }

  authenticate() {
    if (!this.key) {
      throw new Error('You need an API key to use an authenticated route')
    } else if (!this.secret) {
      throw new Error('You need an API secret to use an authenticated route')
    } else if (!this.passphrase) {
      throw new Error(
        'You need an API passphrase to use an authenticated route'
      )
    } else if (!this.connected) {
      throw new Error('You are not connected to the LN Markets websocket')
    }

    const timestamp = Date.now()
    const method = `auth/api-key`
    const payload = `${timestamp}${method}`

    const signature = createHmac('sha256', this.secret)
      .update(payload)
      .digest('base64')

    const request = {
      method,
      params: {
        timestamp,
        signature,
        passphrase: this.passphrase,
        key: this.key,
      },
    }

    return this.send({ request })
  }

  send({ request, id = null }) {
    // Set a random ID if none is sent
    Object.assign(request, {
      method: `${this.version}/${request.method}`,
      jsonrpc: '2.0',
      id: id || randomBytes(8).toString('hex'),
    })

    return new Promise((resolve, reject) => {
      try {
        const message = JSON.stringify(request)
        this.ws.send(message)

        const done = (response) => {
          this.removeListener(response.id, done)

          if (response.error) {
            reject(response.error)
          } else {
            resolve(response.result)
          }
        }

        this.on(request.id, done)
      } catch (error) {
        reject(error)
      }
    })
  }

  onMessage(message) {
    try {
      const response = JSON.parse(message)
      if (response && response.id) {
        this.emit(response.id, response)
      } else {
        this.emit('message', response)
      }
    } catch (error) {
      this.emit('error', response)
    }
  }

  onError(error) {
    this.emit('error', error)
  }

  subscribe({ params, id }) {
    const request = {
      method: 'subscribe',
      params,
    }

    return this.send({ request, id })
  }

  unsubscribe({ params, id }) {
    const request = {
      method: 'unsubscribe',
      params,
    }

    return this.send({ request, id })
  }

  listEvents() {
    const request = {
      method: '__listEvents',
    }

    return this.send({ request })
  }

  listMethods() {
    const request = {
      method: '__listMethods',
    }

    return this.send({ request })
  }

  terminate() {
    this.ws.terminate()
  }
}
