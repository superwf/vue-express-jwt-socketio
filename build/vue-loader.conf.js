var utils = require('./utils')
var config = require('../config')
var isProduction = require('../config/env').isProduction

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: isProduction
      ? config.productionSourceMap
      : config.cssSourceMap,
    extract: isProduction
  }),
  transformToRequire: {
    video: 'src',
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
