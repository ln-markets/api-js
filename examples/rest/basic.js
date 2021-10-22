const { LNMarketsRest } = require('../../index.js')

;(async () => {
  const lnm = new LNMarketsRest()
  const info = await lnm.nodeState()
  console.log(info)
})()
