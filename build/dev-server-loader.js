const cp = require('child_process')
const fs = require('fs')
const debounce = require('lodash/debounce')

let serverProcess = cp.fork('build/dev-server')

const log = console.log

fs.watch('./server', {
  encoding: 'utf8'
}, debounce(() => {
  log('server restarting')
  try {
    serverProcess.kill()
  } catch (e) {
    log(`last server process kill failed, error: ${e}`)
  } finally {
    serverProcess = cp.fork('build/dev-server')
  }
}, 1000))
