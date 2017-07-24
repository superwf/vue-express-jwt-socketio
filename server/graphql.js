import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
// import { graphql } from 'graphql'
import schema from './schema'
import jwt from 'express-jwt'
import config from '../config'

const fakeData = {
  user: [{
    id: 1,
    name: 'user1'
  }, {
    id: 2,
    name: 'user2'
  }]
}

const jwtMiddleware = jwt({
  secret: config.dev.secret
})

export default function (app) {
  app.use('/graphql', jwtMiddleware, function (...args) {
    const [req, ..._] = args
    return graphqlExpress({
      schema,
      rootValue: {
        user ({id}) {
          return fakeData.user[id]
        },
        users () {
          return fakeData.user
        },
        updateUser ({user}, context) {
          const originUser = fakeData.user.find(u => u.id === user.id)
          originUser.name = user.name
          return originUser
        },
        createUser ({user}) {
          user.id = fakeData.user.length + 1
          fakeData.user.push(user)
          return user
        }
      },
      context: {
        user: req.user,
        db: 'xxxxxx',
      }
    })(...args)
  })

  app.use('/graphiql', graphiqlExpress({ schema }))
}
