const WebsocketClient = require('./websocket-client.js')
const EventEmitter = require('eventemitter3')
const { randomBytes } = require('crypto')

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

module.exports = class LNMarketsWebsocket extends EventEmitter {
  constructor(opt = {}) {
    super()
    const { network, version, clientOptions = {} } = opt

    this.ws = undefined
    this.clientOptions = clientOptions
    this.network = network || process.env.LNMARKETS_NETWORK || 'mainnet'
    this.version = version || process.env.LNMARKETS_API_VERSION || 'v1'
    this.hostname = getHostname(this.network)
  }

  connect() {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebsocketClient({
          ...this.clientOptions,
          url: `wss://${this.hostname}`,
        })
      } catch (error) {
        return reject(error)
      }

      this.ws.onOpen = () => {
        this.emit('connected')
        resolve()
      }

      this.ws.onMessage = this.onMessage.bind(this)

      this.ws.connect()
    })
  }

  send({ request, id = null }) {
    // Set a random ID if none is sent
    Object.assign(request, {
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
      console.error(error)
    }
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
