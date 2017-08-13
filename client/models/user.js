import getSocket from '../getSocket'
import store from '../store'
import { ERRORS } from '../store/types'
import { user } from '../../lib/models'

const socket = getSocket()

export const modelProxy = (model) => {
  return new Proxy({}, {
    get (target, property) {
      if (target[property]) {
        return target[property]
      }
      target[property] = (...variables) => {
        return new Promise((resolve, reject) => {
          const req = {
            model,
            action: property,
            variables,
          }
          socket.emit('call', req, response => {
            if (response) {
              if (response.errors) {
                store.commit(ERRORS, response.errors)
              } else if (response.type) {
                store.commit(response.type, response.data)
              }
              resolve(response)
            } else {
              reject(new Error(`no response from call ${JSON.stringify(req)}`))
            }
          })
        })
      }
      return target[property]
    }
  })
}

export default modelProxy(user)
