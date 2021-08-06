const LNMarkets = require('../index.js')

;(async () => {
  const lnm = new LNMarkets()
  const info = await lnm.nodeState()
  console.log(info)
})()
