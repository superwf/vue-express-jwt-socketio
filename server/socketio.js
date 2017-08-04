import jwt from 'jsonwebtoken'
import http from 'http'
import socketio from 'socket.io'
import graphql from './graphql'
import config from '../config'

const verifyToken = token => {
  if (!token) {
    return false
  }
  try {
    const user = jwt.verify(token, config.jwtSecret)
    if (user.exp * 1000 < Date.now()) {
      return false
    }
  } catch (e) {
    return false
  }
  return true
}

export default function socketIO (app) {
  const server = http.Server(app)
  const io = socketio(server, {
    path: '/graphql',
    transports: [
      'websocket',
      'polling'
    ]
  })

  io.on('connection', socket => {
    const { token } = socket.handshake.query
    if (!verifyToken(token)) {
      socket.emit('auth error')
      return socket.disconnect()
    }
    socket.on('query', query => {
      graphql(query).then(data => {
        // 'vuex' event for vuex on client to commit the data
        socket.emit('vuex', data)
      }).catch(error => {
        socket.emit('error', error)
      })
    })
  })
  return server
}
