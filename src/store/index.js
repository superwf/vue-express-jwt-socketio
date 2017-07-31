import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import { LOADING } from './types'

Vue.use(Vuex)

const generateStore = () => {
  return new Vuex.Store({
    state: {
      loading: 0
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
    modules: {
      user
    },
  })
}
export default generateStore
