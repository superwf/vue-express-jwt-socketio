import { ME, USERS, CREATE_USER, UPDATE_USER, TOKEN,
  LOGOUT, LOGIN, NO_AUTH, REMOVE_USER, INITIALIZED } from 'store/types'
import meGql from '../../gql/me.gql'
import usersGql from '../../gql/users.gql'
import createUserGql from '../../gql/createUser.gql'
import updateUserGql from '../../gql/updateUser.gql'
import removeUserGql from '../../gql/removeUser.gql'
import findIndex from 'lodash/findIndex'
import axios from 'axios'
import { emit } from 'store/helpers'

export default {
  state: {
    me: null,
    token: null,
    users: [],
  },
  mutations: {
    [USERS] (state, payload) {
      state.users = payload
    },
    [CREATE_USER] (state, payload) {
      state.users = [...state.users, payload]
    },
    [REMOVE_USER] (state, payload) {
      const index = findIndex(state.users, { id: payload.id })
      if (index > -1) {
        state.users.splice(index, 1)
      }
    },
    [UPDATE_USER] (state, payload) {
      const index = findIndex(state.users, { id: payload.id })
      if (index > -1) {
        state.users.splice(index, 1, payload)
      }
    },
    [NO_AUTH] (state) {
      localStorage.removeItem('token')
      state.me = null
    },
    [ME] (state, payload) {
      state.me = payload
    },
    [TOKEN] (state, token) {
      state.token = token
    },
  },
  actions: {
    [ME] ({ rootGetters, commit }) {
      const token = localStorage.getItem('token')
      rootGetters.socket.emit('query', {
        type: ME,
        query: meGql,
        variables: { token }
      }, data => {
        commit(data.type, data.data)
        commit(INITIALIZED)
      })
    },
    [UPDATE_USER] (context, user, room) {
      return context.rootGetters.socket.emit('query', {
        type: UPDATE_USER,
        query: updateUserGql,
        room,
        variables: { user },
      })
    },
    [CREATE_USER]: emit({
      type: CREATE_USER,
      query: createUserGql
    }),
    [REMOVE_USER]: emit({
      type: REMOVE_USER,
      query: removeUserGql
    }),
    [USERS] ({ rootGetters, commit }) {
      return rootGetters.socket.emit('query', {
        type: USERS,
        query: usersGql
      }, data => {
        commit(data.type, data.data)
      })
    },
    [LOGOUT] ({ commit, rootGetters }) {
      commit(ME, null)
      localStorage.removeItem('token')
      commit(TOKEN, null)
      commit(INITIALIZED, false)
      rootGetters.socket.close()
    },
    [LOGIN] ({ commit, rootGetters, dispatch }, data) {
      const { socket } = rootGetters
      return axios.post('/login', data).then(result => {
        const { token } = result.data
        commit(TOKEN, token)
        localStorage.setItem('token', token)
        socket.io.opts.query = {
          token
        }
        socket.once('connect', () => {
          dispatch(ME)
        })
        socket.connect()
      })
    },
  }
}
