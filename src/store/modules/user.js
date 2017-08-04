import { ME, USERS, ADD_USER } from 'store/types'
import { apolloClient } from '../../apollo'
import usersGql from '../../gql/users.gql'
import getSocket from '@/getSocket'

export default {
  state: {
    me: null,
    users: [],
  },
  mutations: {
    [USERS] (state, payload) {
      state.users = payload
    },
    [ADD_USER] (state, payload) {
      state.users = [...state.users, payload]
    },
    [ME] (state, payload) {
      state.me = payload
    },
  },
  actions: {
    [ME] (_, payload) {
      return apolloClient.query({
        query: usersGql.replace(/\n|\r/, '')
      }).then(console.log)
    },
    async [USERS] () {
      const socket = await getSocket()
      socket.emit('query', {
        type: USERS,
        query: usersGql
      })
    }
  }
}
