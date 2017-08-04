import { buildSchema } from 'graphql'
// import {
//   makeExecutableSchema
// } from 'graphql-tools'

// import resolvers from './resolvers'
// import {
  // GraphQLSchema,
  // GraphQLObjectType,
  // GraphQLInt,
  // GraphQLString,
  // buildSchema,
// } from 'graphql'

// const schema = buildSchema(`
//   type Query {
//    ip: String
//   }
// `)

// const User = new GraphQLObjectType({
//   name: 'User',
//   fields: {
//     id: {
//       type: GraphQLInt
//     },
//     name: {
//       type: GraphQLString,
//       resolve (obj) {
//         return obj.name + 'xxxx'
//       }
//     }
//   },
//   resolve (args) {
//     console.log(args)
//     return fakeData[args.id]
//   }
// })

// const schema = new GraphQLSchema({
//   query: new GraphQLObjectType({
//     name: 'RootQueryType',
//     fields: {
//       user: {
//         args: {
//           id: {
//             type: GraphQLInt
//           }
//         },
//         type: User,
//         resolve (_, args, request) {
//           console.log(request.user)
//           return fakeData.user[args.id]
//         }
//       }
//     }
//   })
// })

// buildSchema就相当于jsx编译一样，将字符编译为graphql的schema嵌套，省得写上面那一大堆乱七八糟的
const typeDefs = `
type User {
  id: Int
  name: String!
  password: String!
}
type Client {
  id: Int!
  name: String!
}
type Query {
  user(id: Int!): User
  users: [User]!
  clients: [Client]!
}
input UserInput {
  id: Int
  name: String!
  password: String!
}

type Subscription {
  userAdded: User
}

type Mutation {
  updateUser(user: UserInput): User
  createUser(user: UserInput): User
}
schema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}
`
export default buildSchema(typeDefs)