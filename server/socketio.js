import jwt from 'jsonwebtoken'
import http from 'http'
import socketio from 'socket.io'
import config from '../config'
import { ERRORS, NO_AUTH } from '../client/store/types'
import models from './models'
import castArray from 'lodash/castArray'

// verify token, and attach user to socket
const verifyToken = (token, socket) => {
  if (!token) {
    return false
  }
  try {
    const user = jwt.verify(token, config.jwtSecret)
    if (user.exp * 1000 < Date.now()) {
      return false
    }
    socket.user = user
  } catch (e) {
    return false
  }
  return true
}

// todo: add more check method here
const checkMethods = []
const checkAuthenticate = (user, req) => {
  return Promise.all(checkMethods.map(method => method(user, req)))
  // if (user && req) {
  //   return Promise.resolve(true)
  // }
  // return Promise.reject(false)
}

// todo: need validate model, action and variables
// todo: validate user auth
const callModelAction = (req, socket) => {
  console.log(req)
  const { model, action, type } = req
  const variables = req.variables ? castArray(req.variables) : []
  if (!model || !action) {
    return Promise.reject('model and action are both needed')
  }
  const { user } = socket
  return checkAuthenticate(user, req).then(ok => {
    if (ok) {
      const promise = variables.length > 0
        ? models[model][action](...variables)
        : models[model][action]()
      return promise.then(data => {
        return {
          type,
          data
        }
      })
    } else {
      return {
        type: ERRORS,
        data: 'NO AUTHENTICATION'
      }
    }
  })
}

export default function socketIO (app) {
  const server = http.Server(app)
  const io = socketio(server, {
    path: config.socketPath,
    transports: [
      'websocket',
      'polling'
    ]
  })

  io.on('connection', socket => {
    const { token } = socket.handshake.query
    if (!verifyToken(token, socket)) {
      socket.emit('vuex', {
        type: NO_AUTH,
        data: null,
      })
      return socket.disconnect()
    }
    socket.on('join', room => {
      socket.join(room)
    })
    socket.on('leave', room => {
      socket.leave(room)
    })
    socket.on('call', (...args) => {
      const [req] = args
      let callback = args[args.length - 1]
      callback = typeof callback === 'function' ? callback : false

      callModelAction(req, socket).then(data => {
        // console.log(callback, data)
        if (callback) {
          callback(data)
        } else {
          // 'vuex' event for vuex on client to commit the data
          socket.emit('vuex', data)
        }
        // if has rooms, broadcast to every room
        if (req.room) {
          socket.to(req.room).emit('vuex', data)
        }
      }).catch(errors => {
        // console.log(errors)
        if (callback) {
          callback({
            type: ERRORS,
            errors: errors.errors ? errors.errors : errors
          })
        }
      })
    })
  })
  return server
}
