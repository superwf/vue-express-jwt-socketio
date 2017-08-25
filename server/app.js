import express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import login from './restful/login'
import captcha from './restful/captcha'
import config from '../config'

const app = express()
app.use(bodyParser.json())
app.use(session({
  secret: config.sessionSecret,
  // cookie: { secure: true }
}))
captcha(app)
login(app)

export default app
