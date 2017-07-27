import { pubsub } from './subscriptions'

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
      return fakeData.user
    },
    clients () {
      return fakeData.user
    },
  },
  Mutation: {
    updateUser (_, {user}, context) {
      const originUser = fakeData.user.find(u => u.id === user.id)
      originUser.name = user.name
      return originUser
    },
    createUser (_, {user}) {
      user.id = fakeData.user.length + 1
      console.log(user)
      fakeData.user.push(user)
      pubsub.publish(USER_ADDED, { userAdded: user })
      return user
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
