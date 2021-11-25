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

  it('No Key', async (done) => {
    try {
      const lnm = new LNMarketsWebsocket()
      await lnm.authenticate()
    } catch (error) {
      expect(error).to.be.instanceOf(Error)
      expect(error.message).to.be.equal(
        'You need an API key to use an authenticated route'
      )
      done()
    }
  })

  it('No Secret', async (done) => {
    try {
      const lnm = new LNMarketsWebsocket({ key: 'toto' })
      await lnm.authenticate()
    } catch (error) {
      expect(error).to.be.instanceOf(Error)
      expect(error.message).to.be.equal(
        'You need an API secret to use an authenticated route'
      )
      done()
    }
  })

  it('No Passphrase', async (done) => {
    try {
      const lnm = new LNMarketsWebsocket({ key: 'toto', secret: 'tutu' })
      await lnm.authenticate()
    } catch (error) {
      expect(error).to.be.instanceOf(Error)
      expect(error.message).to.be.equal(
        'You need an API passphrase to use an authenticated route'
      )
      done()
    }
  })

  after(() => {
    process.env = oldEnv
  })
}
