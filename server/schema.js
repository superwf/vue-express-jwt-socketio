import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString
} from 'graphql'

// const schema = buildSchema(`
//   type Query {
//    ip: String
//   }
// `)

const fakeData = {
  user: [{
    id: 1,
    name: 'user1'
  }, {
    id: 2,
    name: 'user2'
  }]
}

const User = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: GraphQLInt
    },
    name: {
      type: GraphQLString,
      resolve (obj) {
        return obj.name + 'xxxx'
      }
    }
  },
  resolve (args) {
    console.log(args)
    return fakeData[args.id]
  }
})

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      user: {
        args: {
          id: {
            type: GraphQLInt
          }
        },
        type: User,
        resolve (_, args, request) {
          console.log(request.user)
          return fakeData.user[args.id]
        }
      }
    }
  })
})

export default schema
