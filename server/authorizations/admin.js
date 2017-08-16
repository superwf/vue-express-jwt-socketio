import User from '../models/user'

export default (user, req) => {
  // admin can do every thing
  let result
  if (User.isAdmin(user)) {
    result = true
  }
  return Promise.resolve(result)
}
