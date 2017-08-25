// just run server at config port
import config from '../config'
import app from './app'
import socketio from './socketio'
import { dbConnectPromise } from './db'

const { protocol, port, host } = config
const envApp = require(`./${config.env.NODE_ENV}`).default
envApp(app)

const server = socketio(app)

const ready = new Promise(resolve => {
  server.listen(port, () => {
    console.log(`websocket listen at ${protocol}://${host}:${port}`)
    dbConnectPromise.then(resolve)
  })
})
module.exports = {
  server,
  ready
}
