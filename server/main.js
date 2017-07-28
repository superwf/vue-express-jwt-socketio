// just run server at config port
require('babel-register')({
  presets: ['es2015']
})
const config = require('../config')
const { server } = require('./app')

const { port, host } = config
server.listen(port, () => {
  console.log(`websocket listen at ${host}:${port}`)
})
