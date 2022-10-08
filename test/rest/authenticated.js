const { expect } = require('chai')
const { LNMarketsRest } = require('../../src/index.js')

module.exports = () => {
  it('Query Params', async () => {
    const lnm = new LNMarketsRest()
    const user = await lnm.getUser()
    expect(user).to.be.an('object')
  })

  it('Body Params', async () => {
    const lnm = new LNMarketsRest()
    const user = await lnm.updateUser({ username: 'SatoshiNakamoto' })
    expect(user).to.be.an('object')
  })

  it('Should be rejected', () => {
    const lnm = new LNMarketsRest()
    return lnm
      .depositHistory({ limit: 101 })
      .then(() => {
        throw new Error('Was not supposed to succeed')
      })
      .catch((error) => {
        expect(error).to.be.instanceOf(Error)
        expect(error.statusCode).to.be.equal(400)
      })
  })
}
