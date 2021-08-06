const WebsocketClient = require('./lib/Websocket-client.js')
const { EventEmitter } = require('events')

module.exports = class LNMarketsWebsocket extends EventEmitter {
  constructor(opt = {}) {
    super()
    const { network } = opt

    this.ws = undefined
    this.network = network || 'mainnet'
    this.hostname =
      this.network === 'mainnet'
        ? 'api.lnmarkets.com'
        : 'api.testnet.lnmarkets.com'
  }

  connect() {
    return new Promise((resolve, reject) => {
      try {
        const WebsocketOptions = {
          url: `wss://${this.hostname}`,
        }
        this.ws = new WebsocketClient(WebsocketOptions)
      } catch (error) {
        return reject(error)
      }

      this.ws.onOpen = () => {
        this.emit('connected')
        resolve()
      }

      this.ws.onMessage = this._onMessage.bind(this)

      this.ws.connect()
    })
  }

  _onMessage(message) {
    try {
      const data = JSON.parse(message)
      this.emit('message', data)
    } catch (error) {
      console.error(error)
      console.error(message)
    }
  }

  terminate() {
    this.ws.terminate()
  }
}
