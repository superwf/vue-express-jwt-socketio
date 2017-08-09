import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import { ROOM, CURRENT_ROOM, TOKEN, LOADING, SOCKET_ERROR, CONNECTED, ERRORS, INITIALIZED, NO_AUTH } from './types'
import getSocket from '@/getSocket'

Vue.use(Vuex)

const generateStore = async () => {
  const socket = getSocket()

  const store = new Vuex.Store({
    state: {
      // init是最初的状态，当第一次socket成功或失败时变为false
      // 为了防止页面初始化时的登录和连接模块的显示
      initialized: false,
      connected: false,
      // room is the router name
      // currentRoom is current joined room,
      // because every component mountd, the socket will join the room,
      // currentRoom is to prevent client join one room
      // more than one time
      room: null,
      currentRoom: null,
      socketError: null,
      errors: [],
      loading: 0,
    },
    mutations: {
      [LOADING] (state, payload) {
        if (payload) {
          state.loading += 1
        } else {
          state.loading -= 1
        }
      },
      [CONNECTED] (state, connected) {
        state.connected = connected
      },
      [ROOM] (state, room) {
        state.room = room
      },
      [CURRENT_ROOM] (state, room) {
        state.currentRoom = room
      },
      [ERRORS] (state, errors) {
        state.errors = errors
      },
      [INITIALIZED] (state, data) {
        if (data === false) {
          state.initialized = false
        } else {
          state.initialized = true
        }
      },
      [SOCKET_ERROR] (state, error) {
        state.socketError = error
      },
      [NO_AUTH] (state) {
        state.initialized = true
      },
    },
    getters: {
      socket: () => socket
    },
    modules: {
      user
    },
  })
  socket.on('connect', () => {
    store.commit(CONNECTED, true)
    const { room } = store.state
    // when disconnect in a room, reconnect will generate a new socket.id in server, so need rejoin room
    if (room) {
      socket.emit('join', room)
    }
  })
  const token = localStorage.getItem('token')
  if (token) {
    store.commit(TOKEN, token)
  }

  // bind all 'commit' event from socket
  socket.on('vuex', data => {
    if (data.errors) {
      store.commit(ERRORS, data.errors)
    } else {
      store.commit(data.type, data.data)
    }
  })
  socket.on('error', err => {
    store.commit(SOCKET_ERROR, err)
    store.commit(CONNECTED, false)
  })
  socket.on('connect_error', err => {
    store.commit(INITIALIZED)
    store.commit(SOCKET_ERROR, err)
    store.commit(CONNECTED, false)
  })
  socket.on('disconnect', () => {
    store.commit(CONNECTED, false)
  })
  socket.on('reconnect_attempt', count => {
    console.log(count)
  })
  return store
}
export default generateStore
