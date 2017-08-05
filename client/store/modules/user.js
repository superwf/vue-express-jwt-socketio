import { ME, USERS, ADD_USER, LOGOUT, LOGIN, NO_AUTH } from 'store/types'
import meGql from '../../gql/me.gql'
import usersGql from '../../gql/users.gql'
import axios from 'axios'

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
    [NO_AUTH] (state) {
      state.me = null
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
    },
    [LOGOUT] ({ commit, rootState }) {
      commit(ME, null)
      localStorage.removeItem('token')
      rootState.socket.close()
    },
    [LOGIN] ({ commit, rootState }, data) {
      console.log(data)
      return axios.post('/login', data).then(result => {
        const { token } = result.data
        localStorage.setItem('token', token)
        rootState.socket.connect()
      })
    },
  }
}
