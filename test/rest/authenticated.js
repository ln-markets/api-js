const { expect } = require('chai')
const { LNMarketsRest } = require('../../index.js')

module.exports = () => {
  it('Get User', async () => {
    const lnm = new LNMarketsRest()
    const user = await lnm.getUser()
    expect(user).to.be.an('object')
  })

  it('Get Deposit History', async () => {
    const lnm = new LNMarketsRest()
    const history = await lnm.depositHistory({ limit: 100 })
    expect(history).to.be.an('array')
  })

  it('Should be rejected', () => {
    const lnm = new LNMarketsRest()
    return lnm.depositHistory({ limit: 101 }).catch((error) => {
      expect(error).to.be.instanceOf(Error)
      expect(error.statusCode).to.be.equal(400)
    })
  })
}
