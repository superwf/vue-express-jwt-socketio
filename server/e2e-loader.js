require('babel-register')({
  presets: ['es2015']
})
const cp = require('child_process')
const debounce = require('lodash/debounce')
const watch = require('node-watch')

const main = 'test/e2e/runner.js'

let serverProcess = cp.fork(main)

const log = console.log
// 在开发模式运行，当server中的文件更改时重启服务
watch('./test/e2e/specs', {
  recursive: true,
  encoding: 'utf8',
}, debounce(() => {
  log('e2e server restarting')
  try {
    serverProcess.kill()
  } catch (e) {
    log(`last server process kill failed, error: ${e}`)
  } finally {
    serverProcess = cp.fork(main)
  }
}, 1000))
