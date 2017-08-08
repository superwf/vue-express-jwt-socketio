import express from 'express'
import path from 'path'
import config from '../config'

export default function (app) {
  // serve pure static assets
  var staticPath = path.posix.join(config.assetsPublicPath, config.assetsSubDirectory)
  app.use(staticPath, express.static('./static'))
  console.log('Starting dev server...')
  return app
}
