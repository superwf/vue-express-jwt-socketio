import admin from './admin'
import checkUser from './user'
import reduce from 'async/reduce'

export default (user, req) => {
  const checkMethods = [admin, checkUser]
  return new Promise(resolve => {
    reduce(checkMethods, null, (result, check, next) => {
      check(user, req).then(ok => {
        if (typeof ok === 'boolean') {
          return resolve(ok)
        }
        next(null, ok)
      }, err => {
        next(err)
      })
    }, (err, result) => {
      if (err) {
        return Promise.resolve(false)
      }
      return resolve(result || false)
    })
  })
}
