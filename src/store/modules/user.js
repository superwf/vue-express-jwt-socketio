import { ME } from 'store/types'
import { apolloClient } from '../../apollo'
import usersGql from '../../gql/users.gql'

export default {
  state: {
    me: null,
  },
  mutations: {
    [ME] (state, payload) {
      state.me = payload
    },
  },
  actions: {
    [ME] (state, payload) {
      // console.log(apolloClient.readQuery({
      //   query: usersGql
      // }))
      return apolloClient.query({
        query: usersGql
      }).then(console.log)
    }
  }
}
