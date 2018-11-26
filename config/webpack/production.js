process.env.NODE_ENV = process.env.NODE_ENV || 'production'
process.env.WEBSOCKET_URL = process.env.WEBSOCKET_URL || 'wss://multicrosser.chriszetter.com/cable'

const environment = require('./environment')

module.exports = environment.toWebpackConfig()
