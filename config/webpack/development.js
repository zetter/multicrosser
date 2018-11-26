process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.WEBSOCKET_URL = process.env.WEBSOCKET_URL || '/cable'

const environment = require('./environment')

module.exports = environment.toWebpackConfig()
