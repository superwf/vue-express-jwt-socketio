// import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
import graphqlHttp from 'express-graphql'
import schema from './schema'
import expressJwt from 'express-jwt'
// import jwt from 'jsonwebtoken'
// import bodyParser from 'body-parser'
import config from '../config'
import resolvers from './resolvers'
// import { SubscriptionServer } from 'subscriptions-transport-ws'
// import { createServer } from 'http'
// import { execute, subscribe } from 'graphql'

const jwtMiddleware = expressJwt({
  secret: config.jwtSecret
})

export default function (app) {
  // const graphqlMime = 'application/graphql'
  // app.use(bodyParser.text({ type: graphqlMime }), (req, res, next) => {
  //   if (req.is(graphqlMime)) {
  //     req.body = { query: req.body }
  //   }
  //   next()
  // })
  // app.use('/graphql', jwtMiddleware, function (...args) {
  //   // const [req] = args
  //   return graphqlExpress({
  //     schema,
  //   })(...args)
  // })
  // app.use('/graphql', jwtMiddleware, graphqlHttp({
  //   schema,
  //   rootValue: resolvers,
  //   extensions: ({ result }) => {
  //     if (result.errors) {
  //       // const e = new Error()
  //       const e = new Error(result.errors[0].message)
  //       e.status = 422
  //       throw e
  //     }
  //   },
  //   graphiql: true
  // }))

  // const websocketServer = createServer(app)
  // app.use('/subscriptions', (req, res) => {
  //   res.writeHead(404)
  //   res.end()
  // })

  // const subscriptionServer = new SubscriptionServer({
  //   schema,
  //   execute,
  //   subscribe,
  //   onConnect (params, websocket) {
  //     try {
  //       const user = jwt.verify(params.token, config.jwtSecret)
  //       if (user.exp * 1000 < Date.now()) {
  //         websocket.close()
  //         throw new Error('token expired')
  //       }
  //     } catch (e) {
  //       websocket.close()
  //     }
  //   }
  // }, {
  //   server: websocketServer,
  //   path: '/subscriptions',
  // })

  // return websocketServer
}
