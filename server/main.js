// just run server at config port
require('babel-register')({
  presets: ['es2015']
})
const config = require('../config')
const app = require('./app').default
const server = require('http').Server(app)
const io = require('socket.io')(server, {
  path: '/graphql',
  transports: [
    'websocket',
    'polling'
  ]
})

const parseGraphQL = require('./graphql-parse').default
const schema = require('./schema').default
const resolvers = require('./resolvers').default
const parse = parseGraphQL({
  schema,
  rootValue: resolvers
})

const { port, host } = config

server.listen(port, () => {
  console.log(`websocket listen at ${host}:${port}`)
})

io.on('connection', socket => {
  // socket.emit('news', { hello: 'world' })
  // socket.on('other', data => console.log(data))
  socket.on('query', query => {
    parse(query).then(data => {
      socket.emit('commit', data)
    }).catch(error => {
      socket.emit('error', error)
    })
  })
})
