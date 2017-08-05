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
      context.rootGetters.socket.emit('query', {
        type: ME,
        query: meGql,
        variables: { token: localStorage.getItem('token') }
      })
    },
    [USERS] (context) {
      context.rootGetters.socket.emit('query', {
        type: USERS,
        query: usersGql
      })
    },
    [LOGOUT] ({ commit, rootGetters }) {
      commit(ME, null)
      localStorage.removeItem('token')
      rootGetters.socket.close()
    },
    [LOGIN] ({ commit, rootGetters, dispatch }, data) {
      return axios.post('/login', data).then(result => {
        const { token } = result.data
        localStorage.setItem('token', token)
        rootGetters.socket.once('connect', () => {
          dispatch(ME)
        })
        rootGetters.socket.connect()
      })
    },
  }
}
