import { ME, USERS, CREATE_USER, UPDATE_USER, TOKEN,
  LOGOUT, LOGIN, NO_AUTH, DESTROY_USER, INITIALIZED, ERRORS } from 'lib/types'
import findIndex from 'lodash/findIndex'
import axios from 'axios'
// import { generateEmitAction, generateEmitActions } from '../helpers'
import User from '../../models/user'
import storage from '../../storage'

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
    [DESTROY_USER] (state, payload) {
      const index = findIndex(state.users, { id: payload.id })
      if (index > -1) {
        state.users.splice(index, 1)
      }
    },
    [UPDATE_USER] (state, payload) {
      console.log(payload)
      const index = findIndex(state.users, { id: payload.id })
      if (index > -1) {
        state.users.splice(index, 1, payload)
      }
    },
    [NO_AUTH] (state) {
      storage.delete('token')
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
    [ME] ({ commit, state }) {
      return User.me(state.token).then(res => {
        commit(ME, res)
      })
    },
    [USERS] ({ commit }) {
      return User.all().then(res => {
        commit(USERS, res)
      })
    },
    [CREATE_USER] ({ commit, rootState }, payload) {
      return User.create(payload, { type: CREATE_USER, room: rootState.room }).then(user => {
        if (user.type === ERRORS) {
          commit(user.type, user.errors)
        } else {
          commit(CREATE_USER, user)
        }
      })
    },
    [UPDATE_USER] ({ commit, rootState }, payload) {
      return User.findOne({ where: { id: payload.id } }).then(user => {
        return user.update(payload, {fields: ['name', 'password']}, { type: UPDATE_USER, room: rootState.room })
      }).then(user => {
        commit(UPDATE_USER, user)
      })
    },
    [DESTROY_USER] ({ commit, rootState }, payload) {
      return User.findOne({ where: { id: payload } }).then(user => {
        return user.destroy({ type: DESTROY_USER, room: rootState.room })
      }).then(user => {
        commit(DESTROY_USER, user)
      })
    },
    // [UPDATE_USER] (context, payload) {
    //   return generateEmitAction({
    //     type: UPDATE_USER,
    //     model: user,
    //     action: 'update',
    //   })(context, [payload, { fields: ['name', 'password'], where: { id: payload.id } }])
    // },
    // [REMOVE_USER] (context, payload) {
    //   return generateEmitAction({
    //     toRoom: true,
    //     type: REMOVE_USER,
    //     model: user,
    //     action: 'destroy',
    //   })(context, [{ where: { id: payload } }])
    // },
    [LOGOUT] ({ commit, rootGetters }) {
      commit(ME, null)
      storage.delete('token')
      commit(TOKEN, null)
      commit(INITIALIZED, false)
      rootGetters.socket.close()
    },
    [LOGIN] ({ commit, rootGetters, dispatch }, data) {
      const { socket } = rootGetters
      return axios.post('/login', data).then(result => {
        const { token } = result.data
        commit(TOKEN, token)
        storage.set('token', token)
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
