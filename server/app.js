import express from 'express'
import jwt from './jwt'
import graphql from './graphql'
import dev from './dev'

const app = express()
jwt(app)
dev(app)
graphql(app)

export default app
