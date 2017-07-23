import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
// import { graphql } from 'graphql'
import schema from './schema'

const fakeData = {
  user: [{
    id: 1,
    name: 'user1'
  }, {
    id: 2,
    name: 'user2'
  }]
}

export default function (app) {
  app.use('/graphql', graphqlExpress({
    schema,
    rootValue: {
      user ({id}) {
        return fakeData.user[id]
      },
      users () {
        return fakeData.user
      },
      updateUser ({user}) {
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
  }))

  app.use('/graphiql', graphiqlExpress({ schema }))
}
