import User from '../models/user'
import jwt from 'jsonwebtoken'
import config from '../../config'

export default {
  me ({token}) {
    try {
      const user = jwt.verify(token, config.jwtSecret)
      return user
    } catch (e) {
      return Promise.reject(e)
    }
  },
  user ({id}) {
    return User.findOne({
      where: { id }
    })
  },
  users () {
    return User.findAll()
  },
  createUser ({ user }) {
    return User.create(user).then(newUser => {
      return newUser
    })
  },
  updateUser ({user}) {
    return User.findById(user.id).then(u => {
      u.name = user.name
      return u.save()
    })
  },
  removeUser ({id}) {
    return User.findById(id).then(u => {
      return u ? u.destroy().then(() => u) : u
    })
  },
}
