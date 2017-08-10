import { buildSchema } from 'graphql'

const typeDefs = `
type User {
  id: String
  name: String!
  password: String
}
type Client {
  id: String
  name: String!
}
type Query {
  user(id: String!): User
  me(token: String!): User
  users: [User]!
  clients: [Client]!
}
input UserInput {
  id: String
  name: String!
  password: String
}

type Subscription {
  userAdded: User
}

type Mutation {
  updateUser(user: UserInput): User
  createUser(user: UserInput): User
  removeUser(id: String): User
}
schema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}
`
export default buildSchema(typeDefs)
