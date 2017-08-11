import { ME, USERS, CREATE_USER, UPDATE_USER, TOKEN,
  LOGOUT, LOGIN, NO_AUTH, REMOVE_USER, INITIALIZED, ERRORS } from 'store/types'
import findIndex from 'lodash/findIndex'
import axios from 'axios'
import { generateEmitAction, generateEmitActions } from 'store/helpers'
import { user } from '../../../lib/models'

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
      state.users = [payload, ...state.users]
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
    ...generateEmitActions([{
      model: user,
      action: 'me',
      type: ME,
      callback: ({ commit }) => {
        commit(INITIALIZED)
      }
    }, {
      model: user,
      type: USERS,
      action: 'findAll',
    }, {
      toRoom: true,
      type: CREATE_USER,
      model: user,
      action: 'create',
    }]),
    [UPDATE_USER] (context, payload) {
      return generateEmitAction({
        type: UPDATE_USER,
        model: user,
        action: 'update',
      })(context, [payload, { fields: ['name', 'password'], where: { id: payload.id } }])
    },
    [REMOVE_USER] (context, payload) {
      return generateEmitAction({
        toRoom: true,
        type: REMOVE_USER,
        model: user,
        action: 'destroy',
      })(context, [{ where: { id: payload } }])
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
          dispatch(ME, token)
        })
        socket.connect()
      }).catch(e => {
        if (e.response && e.response.status === 401) {
          commit(ERRORS, [{
            message: '用户名或密码错误'
          }])
        }
      })
    },
  }
}
