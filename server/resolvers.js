import { pubsub } from './subscriptions'
import User from './models/user'

const fakeData = {
  user: [{
    id: 1,
    name: 'user1'
  }, {
    id: 2,
    name: 'user2'
  }]
}

const USER_ADDED = 'USER_ADDED'

export default {
  Query: {
    user ({id}) {
      return fakeData.user[id]
    },
    users () {
      return User.findAll()
    },
    clients () {
      return fakeData.user
    },
  },
  Mutation: {
    updateUser (_, {user}, context) {
      return User.findById(user.id).then(u => {
        u.name = user.name
        return u.save()
      })
    },
    createUser (_, {user}) {
      return User.create(user).then(newUser => {
        pubsub.publish(USER_ADDED, { userAdded: newUser })
        return newUser
      })
    },
  },
  Subscription: {
    userAdded: {
      subscribe () {
        return pubsub.asyncIterator(USER_ADDED)
      },
      // resolve (payload) {
      //   console.log(payload)
      //   return payload.userAdded
      // }
    }
  }
}
