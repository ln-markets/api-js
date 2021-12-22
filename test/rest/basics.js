const { expect } = require('chai')
const { LNMarketsRest } = require('../../src/index.js')

let oldEnv = {}

module.exports = () => {
  before(() => {
    oldEnv = JSON.parse(JSON.stringify(process.env))

    delete process.env.LNMARKETS_API_KEY
    delete process.env.LNMARKETS_API_PASSPHRASE
    delete process.env.LNMARKETS_API_SECRET
  })

  it('New LNMarketsRest', () => {
    const lnm = new LNMarketsRest()
    expect(lnm).to.be.instanceOf(LNMarketsRest)
  })

  it('Domain does not exist', (done) => {
    process.env.LNMARKETS_API_HOSTNAME = 'api.lnmarkets.lol'

    const lnm = new LNMarketsRest()

    lnm.appNode().catch((error) => {
      expect(error).to.be.instanceOf(Error)
      expect(error.message).to.be.equal(
        'getaddrinfo ENOTFOUND api.lnmarkets.lol'
      )
      done()
    })

    delete process.env.LNMARKETS_API_HOSTNAME
  })

  it('No Key', async (done) => {
    try {
      const lnm = new LNMarketsRest({ key: null })
      await lnm.futuresCancelAllPositions()
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
      const lnm = new LNMarketsRest({ key: 'toto' })
      await lnm.futuresCancelAllPositions()
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
      const lnm = new LNMarketsRest({ key: 'toto', secret: 'tutu' })
      await lnm.futuresCancelAllPositions()
    } catch (error) {
      expect(error).to.be.instanceOf(Error)
      expect(error.message).to.be.equal(
        'You need an API passphrase to use an authenticated route'
      )
      done()
    }
  })

  it('Good request', async () => {
    const lnm = new LNMarketsRest()
    const info = await lnm.appNode()
    expect(info).to.be.an('object')
  })

  after(() => {
    process.env = oldEnv
  })
}
