import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
import schema from './schema'
import expressJwt from 'express-jwt'
import jwt from 'jsonwebtoken'
import config from '../config'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { createServer } from 'http'
import { execute, subscribe } from 'graphql'

const jwtMiddleware = expressJwt({
  secret: config.jwtSecret
})

export default function (app) {
  app.use('/graphql', jwtMiddleware, function (...args) {
    // const [req] = args
    return graphqlExpress({
      schema,
    })(...args)
  })

  app.use('/graphiql', graphiqlExpress({ schema }))

  const websocketServer = createServer(app)
  app.use('/subscriptions', (req, res) => {
    res.writeHead(404)
    res.end()
  })

  const subscriptionServer = new SubscriptionServer({
    schema,
    execute,
    subscribe,
    onConnect (params, websocket) {
      try {
        const user = jwt.verify(params.token, config.jwtSecret)
        if (user.exp * 1000 < Date.now()) {
          websocket.close()
          throw new Error('token expired')
        }
      } catch (e) {
        websocket.close()
      }
    }
  }, {
    server: websocketServer,
    path: '/subscriptions',
  })

  return websocketServer
}
