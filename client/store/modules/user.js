import { ME, USERS, ADD_USER } from 'store/types'
import meGql from '../../gql/me.gql'
import usersGql from '../../gql/users.gql'

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
    [ME] (context) {
      context.rootState.socket.emit('query', {
        type: ME,
        query: meGql,
        variables: { token: localStorage.getItem('token') }
      })
    },
    [USERS] (context) {
      context.rootState.socket.emit('query', {
        type: USERS,
        query: usersGql
      })
    }
  }
}
