import { buildSchema } from 'graphql'

const schema = buildSchema(`
  type Query {
   ip: String
  }
`)
console.log(schema)

export default schema
