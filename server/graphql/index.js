import schema from './schema'
import resolvers from './resolvers'
import parseGraphQL from './parse'

const parse = parseGraphQL({
  schema,
  rootValue: resolvers
})

export default parse
