const { LNMarketsWebsocket } = require('../../src/index.js')

;(async () => {
  try {
    const lnm = new LNMarketsWebsocket()

    lnm.on('message', (message) => {
      console.log(message)
    })

    await lnm.connect()

    const params = ['futures/market/index', 'futures/market/bid-offer']
    const subscribe = await lnm.subscribe({ params })
    console.log(`LNM Websockets subscribe to ${subscribe}`)
    const unsubscribe = await lnm.unsubscribe({ params })
    console.log(`LNM Websockets unsubscribe to ${unsubscribe}`)
    lnm.terminate()
  } catch (error) {
    console.error(error)
    process.exit(-1)
  }
})()
