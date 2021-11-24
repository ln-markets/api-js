const { expect } = require('chai')
const { LNMarketsWebsocket } = require('../../index.js')

let oldEnv = {}

module.exports = () => {
  before(() => {
    oldEnv = JSON.parse(JSON.stringify(process.env))

    delete process.env.LNMARKETS_API_KEY
    delete process.env.LNMARKETS_API_PASSPHRASE
    delete process.env.LNMARKETS_API_SECRET
  })

  it('New LNMarketsWebsocket', () => {
    const lnm = new LNMarketsWebsocket()
    expect(lnm).to.be.instanceOf(LNMarketsWebsocket)
  })

  after(() => {
    process.env = oldEnv
  })
}
