const dotenv = require('dotenv')

before(() => {
  dotenv.config()
})

describe('Rest', require('./rest/index.js'))
describe('Websockets', require('./websockets/index.js'))
