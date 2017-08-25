import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import getSocket from '../socket'
import storage from './storage'
import { ME, TOKEN, ROOM, CONNECTED, ERROR, SHIFT_ERROR } from 'lib/types'

Vue.use(Vuex)

const emitter = new Vue()

export default () => {
  const socket = getSocket()
  const store = new Vuex.Store({
    state: {
      room: null,
      connected: false,
      token: storage.get('token') || null,
      errors: [],
    },
    mutations: {
      [ROOM] (state, room) {
        state.room = room
      },
      [CONNECTED] (state, connected) {
        state.connected = connected
      },
      [TOKEN] (state, token) {
        storage.set('token', token)
        state.token = token
      },
      [ERROR] (state, error) {
        state.errors.push(error)
      },
      [SHIFT_ERROR] (state, error) {
        state.errors.shift()
      },
    },
    getters: {
      socket: () => socket,
      emitter: () => emitter
    },
    modules: {
      user
    },
  })

  socket.on('connect', () => {
    store.dispatch(ME, store.state.user.token)
    store.commit(CONNECTED, true)
  })
  socket.on('disconnect', () => {
    store.commit(CONNECTED, false)
  })
  return store
}
