import config from '../config'
import utils from './utils'
import { isProduction } from '../config/env'

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
