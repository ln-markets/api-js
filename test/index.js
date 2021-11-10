const { expect } = require('chai')
const { LNMarketsRest } = require('../index.js')

describe('Rest', () => {
  it('New LNMarketsRest', () => {
    const lnm = new LNMarketsRest()
    expect(lnm).to.be.instanceOf(LNMarketsRest)
  })

  it('Domain does not exis', (done) => {
    process.env.LNMARKETS_API_HOSTNAME = 'api.lnmarkets.fr'

    const lnm = new LNMarketsRest()

    lnm.nodeState().catch((error) => {
      expect(error).to.be.instanceOf(Error)
      expect(error.message).to.be.equal(
        'getaddrinfo ENOTFOUND api.lnmarkets.fr'
      )
      done()
    })

    delete process.env.LNMARKETS_API_HOSTNAME
  })

  it('Good request', async () => {
    const lnm = new LNMarketsRest()
    const info = await lnm.nodeState()
    expect(info).to.be.an('object')
  })

  it('No Api Key', () => {
    const lnm = new LNMarketsRest()
    try {
      lnm.futuresCancelAllPositions()
    } catch (error) {
      expect(error).to.be.instanceOf(Error)
      expect(error.message).to.be.equal(
        'You need an API key to use an authenficated route'
      )
    }
  })
})
