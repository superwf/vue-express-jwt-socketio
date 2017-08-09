import express from 'express'
import path from 'path'
import webpack from 'webpack'
import webpackConfig from '../build/webpack.test.conf'
import config from '../config'

export default function (app) {
  var compiler = webpack(webpackConfig)

  var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true
  })

  // handle fallback for HTML5 history API
  app.use(require('connect-history-api-fallback')())

  // serve webpack bundle output
  app.use(devMiddleware)

  // serve pure static assets
  const staticPath = path.posix.join(config.assetsPublicPath, config.assetsSubDirectory)
  app.use(staticPath, express.static('./static'))

  devMiddleware.waitUntilValid(() => {
    const uri = `http://${config.host}:${config.port}`
    console.log('Listening at ' + uri + '\n')
  })
  return app
}
