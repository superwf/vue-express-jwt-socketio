import Promise from 'bluebird'
import { ERRORS } from 'store/types'

// deal with socket emit with room
export const emit = ({ type, query }) => ({ rootGetters, rootState, commit }, variables) => {
  const { room } = rootState
  const data = {
    type,
    query,
  }
  room ? data.room = room : null
  variables ? data.variables = variables : null
  return new Promise((resolve, reject) => {
    rootGetters.socket.emit('query', data, response => {
      // console.log(response)
      if (response.errors) {
        commit(ERRORS, response.errors)
      } else {
        commit(response.type, response.data)
      }
      resolve(response)
    })
  })
}
