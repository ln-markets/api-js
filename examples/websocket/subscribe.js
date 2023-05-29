const { LNMarketsWebsocket } = require('../../src/index.js')

;(async () => {
  try {
    const lnm = new LNMarketsWebsocket()

    lnm.on('message', (message) => {
      console.log(message)
    })

    await lnm.connect()
    const params = ['futures/btc_usd/index', 'futures/btc_usd/lastPrice']
    await lnm.subscribe({ params })
  } catch (error) {
    console.error(error)
    process.exit(-1)
  }
})()
