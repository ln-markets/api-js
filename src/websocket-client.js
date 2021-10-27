const Websocket = require('ws')

module.exports = class WebsocketClient {
  constructor(opt = {}) {
    const { url, ping, reconnect, enableQueue } = opt
    this.url = url
    this.ping = ping || 5000
    this.reconnect = reconnect || 10000
    this.enableQueue = enableQueue || false

    this.timeout = {
      ping: undefined,
      reconnect: undefined,
    }

    this.queue = []
  }

  onOpen(e) {}
  onMessage(data, flags) {}
  onError(e) {}
  onClose(e) {}
  onconnect() {}

  connect() {
    this.ws = new Websocket(this.url)
    this.ws.on('open', this.open.bind(this))
    this.ws.on('message', this.message.bind(this))
    this.ws.on('close', this.close.bind(this))
    this.ws.on('error', this.error.bind(this))
    this.ws.on('pong', this.pong.bind(this))
  }

  open() {
    this.connected = true
    this.onOpen()
    this.sendPing()

    while (this.queue.length) {
      this.ws.send(this.queue.shift())
    }
  }

  message(data, flags) {
    this.sendPing()
    this.onMessage(data, flags)
  }

  close(error) {
    this.onClose(error)
  }

  error(error) {
    console.error(error)
    this.onError(error)
    this.connected = false
    this.sendPing()
  }

  pong() {
    this.sendPing()
  }

  sendPing() {
    clearTimeout(this.timeout.ping)
    clearTimeout(this.timeout.reconnect)

    if (this.connected) {
      this.timeout.ping = setTimeout(() => {
        this.ws.ping()
      }, this.ping)
    }

    this.timeout.reconnect = setTimeout(() => {
      this.connected = false
      this.ws.terminate()
      this.connect()
    }, this.reconnect)
  }

  send(data) {
    if (!this.connected && this.enableQueue) this.queue.push(data)
    else if (!this.connected)
      throw new Error('Websocket Client is not connected')
    else this.ws.send(data)
  }

  terminate() {
    clearTimeout(this.timeout.ping)
    clearTimeout(this.timeout.reconnect)
    this.ws.terminate()
  }
}
