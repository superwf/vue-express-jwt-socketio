import Promise from 'bluebird'
import { ERRORS } from './types'
import reduce from 'lodash/reduce'
import castArray from 'lodash/castArray'

const checkParam = param => {
  const { model, action, type, callback } = param
  let msg = null
  if (!model || !action || !type) {
    msg = 'param must has model, action and type props'
  }
  if (callback && typeof callback !== 'function') {
    msg = 'callback must be function'
  }
  if (msg) {
    throw new Error(`param: ${JSON.stringify(param)}, ${msg}`)
  }
}

// deal with socket emit with or without room
export const generateEmitAction = param => (context, variables) => {
  const { model, action, type, callback, toRoom } = param
  checkParam(param)
  const { rootGetters, rootState, commit } = context
  const req = {
    type,
    model,
    action,
  }
  if (toRoom) {
    const { room } = rootState
    room ? (req.room = room) : null
  }
  variables !== undefined ? (req.variables = castArray(variables)) : null
  return new Promise((resolve, reject) => {
    rootGetters.socket.emit('call', req, response => {
      if (response) {
        if (response.errors) {
          commit(ERRORS, response.errors)
        } else if (response.type) {
          commit(response.type, response.data)
        }
        resolve(response)
        if (callback) {
          callback(context, response)
        }
      } else {
        throw new Error(`no response from call ${JSON.stringify(req)}`)
      }
    })
  })
}

export const generateEmitActions = params => {
  return reduce(params, (r, param) => {
    r[param.type] = generateEmitAction(param)
    return r
  }, {})
}
