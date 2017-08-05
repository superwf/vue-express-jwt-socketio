import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import { LOADING, SOCKET, SOCKET_ERROR } from './types'
import getSocket from '@/getSocket'

Vue.use(Vuex)

const generateStore = async () => {
  const store = new Vuex.Store({
    state: {
      loading: 0,
      socket: null
    },
    mutations: {
      [LOADING] (state, payload) {
        if (payload) {
          state.loading += 1
        } else {
          state.loading -= 1
        }
      },
      [SOCKET] (state, socket) {
        state.socket = socket
      }
    },
    modules: {
      user
    },
  })

  // store.__proto__.xxxx = 'xxxx'

  // bind all 'commit' event from socket
  const socket = await getSocket()
  store.commit(SOCKET, socket)
  socket.on('vuex', data => {
    if (data.errors) {
      console.log(data)
    } else {
      store.commit(data.type, data.data)
    }
  })
  socket.on('error', err => {
    store.commit(SOCKET_ERROR, err)
  })
  return store
}
export default generateStore
