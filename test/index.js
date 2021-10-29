const { expect } = require('chai')
const { LNMarketsRest } = require('../index.js')

describe('Rest', () => {
  it('New LNMarketsRest', () => {
    const lnm = new LNMarketsRest()
    expect(lnm).to.be.instanceOf(LNMarketsRest)
  })

  it('Domain does not exis', (done) => {
    process.env.LNMARKETS_API_URL = 'api.lnmarkets.fr'

    const lnm = new LNMarketsRest()

    lnm.nodeState().catch((error) => {
      expect(error).to.be.instanceOf(Error)
      expect(error.message).to.be.equal(
        'getaddrinfo ENOTFOUND api.lnmarkets.fr'
      )
      done()
    })

    delete process.env.LNMARKETS_API_URL
  })

  it('Good request', async () => {
    const lnm = new LNMarketsRest()
    const info = await lnm.nodeState()
    expect(info).to.be.an('object')
  })

  it('Unauthorized', (done) => {
    const lnm = new LNMarketsRest()
    lnm.futuresCancelAllPositions().catch((error) => {
      expect(error).to.be.instanceOf(Error)
      expect(error.statusCode).to.be.equal(401)
      expect(error.code).to.be.equal('Unauthorized')
      done()
    })
  })
})
