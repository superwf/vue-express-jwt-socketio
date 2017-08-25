import { ME, TOKEN, LOGIN, LOGOUT, ERROR, USER_LIST } from 'lib/types'
import axios from 'axios'
import storage from '../storage'
import User from 'models/user'

export default {
  state: {
    me: {},
    token: storage.get('token') || null,
    list: {},
    loginError: null,
  },
  mutations: {
    [ME] (state, payload) {
      state.me = payload
    },
    [USER_LIST] (state, payload) {
      state.list = payload
    }
  },
  actions: {
    [ME] ({ commit }) {
      return User.me(storage.get('token')).then(res => {
        commit(ME, res)
      })
    },
    [LOGIN] ({ commit, rootGetters, dispatch, state }, user) {
      const { socket } = rootGetters
      return axios.post('/login', user).then(res => {
        const { token } = res.data
        commit(TOKEN, token)
        socket.io.opts.query = {
          token
        }
        // fetch user info once connected
        socket.connect()
      }).catch(e => {
        commit(TOKEN, null)
        if (e.response) {
          let message = {
            type: 'danger',
            message: '服务器错误'
          }
          if (e.response.status === 401) {
            message.message = '用户名或密码错误'
          } else if (e.response.status === 406) {
            rootGetters.emitter.$emit('captchaRefresh')
            message.message = '验证码错误'
          }
          commit(ERROR, message)
        }
      })
    },
    [LOGOUT] ({ commit, rootGetters }) {
      const { socket } = rootGetters
      socket.io.opts.query = {
        token: null
      }
      commit(TOKEN, null)
      commit(ME, {})
      socket.close()
    },
    [USER_LIST] ({ commit }, query) {
      return User.findAndCountAll(query).then(res => {
        commit(USER_LIST, res)
        return res
      })
    },
  },
}
