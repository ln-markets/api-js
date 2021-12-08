const { LNMarketsRest } = require('../../index.js')

;(async () => {
  const lnm = new LNMarketsRest()
  const info = await lnm.futuresGetTicker()
  console.log(info)
})()
