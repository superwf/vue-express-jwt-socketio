import User from '../models/user'

export default {
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
  updateUser (_, {user}, context) {
    return User.findById(user.id).then(u => {
      u.name = user.name
      return u.save()
    })
  },
}
