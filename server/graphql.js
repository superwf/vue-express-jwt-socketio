import graphqlExpress from 'express-graphql'
// import { graphql } from 'graphql'
import schema from './schema'

export default function (app) {
  app.use('/graphql', graphqlExpress({
    schema,
    graphiql: true
  }))
}
