const { LNMarketsHttp } = require('../../index.js')

;(async () => {
  const lnm = new LNMarketsHttp()
  const info = await lnm.nodeState()
  console.log(info)
})()
