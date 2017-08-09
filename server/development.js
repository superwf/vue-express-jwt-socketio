import express from 'express'
import path from 'path'
import webpack from 'webpack'
import proxyMiddleware from 'http-proxy-middleware'
import webpackConfig from '../build/webpack.development.conf'
import config from '../config'

export default function (app) {
  // Define HTTP proxies to your custom API backend
  // https://github.com/chimurai/http-proxy-middleware
  var proxyTable = config.proxyTable

  var compiler = webpack(webpackConfig)

  var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true
  })

  var hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: () => {},
    heartbeat: 2000
  })
  // force page reload when html-webpack-plugin template changes
  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
      hotMiddleware.publish({ action: 'reload' })
      cb()
    })
  })

  // proxy api requests
  Object.keys(proxyTable).forEach(function (context) {
    var options = proxyTable[context]
    if (typeof options === 'string') {
      options = { target: options }
    }
    app.use(proxyMiddleware(options.filter || context, options))
  })

  // handle fallback for HTML5 history API
  app.use(require('connect-history-api-fallback')())

  // serve webpack bundle output
  app.use(devMiddleware)

  // enable hot-reload and state-preserving
  // compilation error display
  app.use(hotMiddleware)

  // serve pure static assets
  const staticPath = path.posix.join(config.assetsPublicPath, config.assetsSubDirectory)
  app.use(staticPath, express.static('./static'))

  const uri = `http://${config.host}:${config.port}`

  console.log('Starting dev server...')
  devMiddleware.waitUntilValid(() => {
    console.log('Listening at ' + uri + '\n')
    if (config.autoOpenBrowser) {
      process.send && process.send('openBrowser')
    }
  })
  return app
}
