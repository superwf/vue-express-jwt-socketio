import express from 'express'
import jwt from './jwt'
import dev from './dev'

const app = express()
jwt(app)
dev(app)

export default app
