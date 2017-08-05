import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import { LOADING, SOCKET_ERROR } from './types'
import getSocket from '@/getSocket'

Vue.use(Vuex)

const generateStore = async () => {
  const socket = await getSocket()

  const store = new Vuex.Store({
    state: {
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
    },
    getters: {
      socket: () => socket
    },
    modules: {
      user
    },
  })

  // store.__proto__.xxxx = 'xxxx'

  // bind all 'commit' event from socket
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
