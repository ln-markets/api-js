const LNMarkets = require('../index.js')

;(async () => {
  const lnm = new LNMarkets()
  const { body: info } = await lnm.nodeState()
  console.log(info)
})()
