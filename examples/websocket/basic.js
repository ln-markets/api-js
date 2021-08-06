const { LNMarketsWebsocket } = require('../../index.js')

;(async () => {
  const lnm = new LNMarketsWebsocket()
  lnm.on('connected', () => {
    console.log('Connected to LN Markets Webosckets')
  })
  lnm.on('message', (message) => {
    console.log(message)
    lnm.terminate()
  })
  await lnm.connect()
})()
