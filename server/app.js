import express from 'express'
import jwt from './jwt'

const nodeEnv = require('../config/env').env
const envApp = require(`./${nodeEnv}`).default

const app = express()
jwt(app)
envApp(app)

export default app
