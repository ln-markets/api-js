const { LNMarketsWebsocket } = require('../../src/index.js')

;(async () => {
  try {
    const lnm = new LNMarketsWebsocket()
    lnm.on('connected', () => {
      console.log('Connected to LN Markets websocket')
    })

    lnm.on('message', (message) => {
      console.log(message)
    })

    await lnm.connect()
    await lnm.authenticate().then(console.log)
    await lnm.terminate()
  } catch (error) {
    console.error(error)
    process.exit(-1)
  }
})()
