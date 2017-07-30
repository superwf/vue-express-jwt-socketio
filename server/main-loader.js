require('babel-register')({
  presets: ['es2015']
})
const cp = require('child_process')
const fs = require('fs')
const opn = require('opn')
const config = require('../config')
const debounce = require('lodash/debounce')

const main = 'server/main'

let serverProcess = cp.fork(main)

// when first run server process, auto open browser
serverProcess.once('message', () => {
  const { host, port, autoOpenBrowser } = config
  if (autoOpenBrowser) {
    opn(`http://${host}:${port}`)
  }
})

const log = console.log
// 在开发模式运行，当server中的文件更改时重启服务
fs.watch('./server', {
  encoding: 'utf8'
}, debounce(() => {
  log('server restarting')
  try {
    serverProcess.kill()
  } catch (e) {
    log(`last server process kill failed, error: ${e}`)
  } finally {
    serverProcess = cp.fork(main)
  }
}, 1000))
