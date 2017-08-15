import jwt from 'jsonwebtoken'
import http from 'http'
import socketio from 'socket.io'
import config from '../config'
import { ERRORS, NO_AUTH } from '../lib/types'
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
  const { model, action } = req
  const variables = req.variables ? castArray(req.variables) : []
  if (!model || !action) {
    return Promise.reject('callModelAction: model and action are both needed')
  }
  const { user } = socket
  return checkAuthenticate(user, req).then(ok => {
    if (ok) {
      return models[model][action](...variables)
    } else {
      throw new Error('NO_AUTH')
    }
  })
}

const callInstanceAction = (req, socket) => {
  const { target, model, action } = req
  const variables = req.variables ? castArray(req.variables) : []
  if (!model || !action) {
    return Promise.reject('callInstanceAction: model and action are both needed')
  }
  // todo: use primary key to replace 'id'
  if (!target.id) {
    return Promise.reject('callInstanceAction: target must has id')
  }
  const { user } = socket
  return checkAuthenticate(user, req).then(ok => {
    if (ok) {
      return models[model].findOne({
        where: { id: target.id }
      }).then(row => {
        // console.log(action, row[action], variables)
        if (row) {
          const promise = row[action](...variables)
          if (action === 'destroy') {
            return promise.then(() => row)
          } else {
            return promise
          }
        }
        throw new Error(`${target.id} not exist in table ${model}`)
      })
    } else {
      throw new Error('NO_AUTH')
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
    socket.on('modelCall', (...args) => {
      const [req, callback] = args
      // let callback = args[args.length - 1]
      // callback = typeof callback === 'function' ? callback : false

      callModelAction(req, socket).then(data => {
        if (callback) {
          callback(data)
        }
        // else {
        //   // 'vuex' event for vuex on client to commit the data
        //   socket.emit('vuex', data)
        // }
        // if has rooms, broadcast to every room
        if (req.room) {
          socket.to(req.room).emit('vuex', {
            type: req.type,
            data
          })
        }
      }).catch(errors => {
        if (callback) {
          callback({
            type: ERRORS,
            errors: errors.errors ? errors.errors : errors
          })
        }
      })
    })
    socket.on('instanceCall', (...args) => {
      const [req, callback] = args

      callInstanceAction(req, socket).then(data => {
        callback(data)
        console.log(req)
        if (req.room) {
          socket.to(req.room).emit('vuex', {
            type: req.type,
            data
          })
        }
      }).catch(errors => {
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
