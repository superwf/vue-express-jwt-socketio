import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
// import { graphql } from 'graphql'
import schema from './schema'

export default function (app) {
  app.use('/graphql', graphqlExpress({
    schema
  }))

  app.use('/graphiql', graphiqlExpress({ schema }))
}
