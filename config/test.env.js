var merge = require('webpack-merge')
var devEnv = require('./development.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"test"'
})
