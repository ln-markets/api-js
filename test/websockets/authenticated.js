const { expect } = require('chai')
const { LNMarketsWebsocket } = require('../../src/index.js')

module.exports = () => {
  it('Not connected', async (done) => {
    try {
      const lnm = new LNMarketsWebsocket()
      await lnm.authenticate()
    } catch (error) {
      expect(error).to.be.instanceOf(Error)
      expect(error.message).to.be.equal(
        'You are not connected to the LN Markets websocket'
      )
      done()
    }
  })

  it('Connect and authenticate and terminate', async () => {
    const lnm = new LNMarketsWebsocket()
    await lnm.connect()
    await lnm.authenticate()
    await lnm.terminate()
  })
}
