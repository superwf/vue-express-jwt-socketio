import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
// import { graphql } from 'graphql'
import schema from './schema'
import jwt from 'express-jwt'
import config from '../config'
// import { PubSub, SubscriptionManager  } from 'graphql-subscriptions'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { createServer } from 'http'
import { execute, subscribe } from 'graphql'
// import { pubsub } from './subscriptions'

const jwtMiddleware = jwt({
  secret: config.dev.secret
})

// const USER_ADDED = 'USER_ADDED'

export default function (app) {
  app.use('/graphql', jwtMiddleware, function (...args) {
    // const [req] = args
    return graphqlExpress({
      schema,
    })(...args)
  })

  app.use('/graphiql', graphiqlExpress({ schema }))

  const websocketServer = createServer((req, res) => {
    res.writeHead(404)
    res.end()
  })
  websocketServer.listen(5000, () => {
    console.log('websocket listen at 5000')
  })

  const subscriptionServer = new SubscriptionServer({
    schema,
    execute,
    subscribe,
  }, {
    server: websocketServer,
    path: '/subscriptions',
  })

  // console.log(subscriptionServer)
}
