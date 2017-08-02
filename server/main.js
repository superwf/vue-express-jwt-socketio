// just run server at config port
require('babel-register')({
  presets: ['es2015']
})
const config = require('../config')
const app = require('./app').default

const { port, host } = config
app.listen(port, () => {
  console.log(`websocket listen at ${host}:${port}`)
})
