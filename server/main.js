// just run server at config port
require('babel-register')({
  presets: ['es2015']
})
const config = require('../config').default
const app = require('./app').default
const socketio = require('./socketio').default

const { port, host } = config

const server = socketio(app)

const ready = new Promise(resolve => {
  server.listen(port, () => {
    console.log(`websocket listen at ${host}:${port}`)
    resolve()
  })
})
module.exports = {
  server,
  ready
}
