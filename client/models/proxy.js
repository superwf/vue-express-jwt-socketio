// proxy all Model methods and variables to server end
// make front can use sequelize Model api

const isBroadcastOption = option => {
  if (option) {
    const keys = Object.keys(option)
    if (keys.indexOf('room') > -1 && keys.indexOf('type') > -1) {
      return true
    }
  }
  return false
}

const instanceProxy = (obj, socket, model) => {
  return new Proxy(obj, {
    get (target, property) {
      if (target[property]) {
        return target[property]
      }
      if (['save', 'update', 'destroy'].indexOf(property) === -1) {
        return undefined
      }
      target[property] = (...variables) => {
        let option = variables[variables.length - 1]
        if (isBroadcastOption(option)) {
          variables.pop()
        } else {
          option = {}
        }
        return new Promise((resolve, reject) => {
          const req = {
            ...option,
            model,
            target,
            action: property,
            variables
          }
          socket.emit('instanceCall', req, response => {
            if (response !== undefined) {
              resolve(response)
            } else {
              reject(new Error(`no response from req ${JSON.stringify(req)}`))
            }
          })
        })
      }
      return target[property]
    }
  })
}

const modelProxy = (model, socket) => {
  return new Proxy({
    name: model,
  }, {
    get (target, property) {
      if (target[property]) {
        return target[property]
      }
      target[property] = (...variables) => {
        let option = variables[variables.length - 1]
        if (isBroadcastOption(option)) {
          variables.pop()
        } else {
          option = {}
        }
        return new Promise((resolve, reject) => {
          const req = {
            ...option,
            model,
            action: property,
            variables,
          }
          socket.emit('modelCall', req, response => {
            // proxy instance
            if (property === 'findOne') {
              response = instanceProxy(response, socket, model)
            }
            if (property === 'findAll') {
              response = response.map(res => instanceProxy(res, socket, model))
            }

            if (response !== undefined) {
              resolve(response)
            } else {
              reject(new Error(`no response from req ${JSON.stringify(req)}`))
            }
          })
        })
      }
      return target[property]
    }
  })
}
export default modelProxy
