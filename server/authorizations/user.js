// import User from '../models/user'
import * as models from '../../lib/models'

export default (user, req) => {
  let result
  if (req.model === models.user) {
    if ([
      'updateEmail',
      'updatePassword'
    ].indexOf(req.action) > -1) {
      result = true
    }
  }
  return Promise.resolve(result)
}
