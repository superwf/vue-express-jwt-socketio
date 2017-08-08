// deal with socket emit with room
export const emit = ({ type, query }) => ({ rootGetters, rootState }, variables) => {
  const { room } = rootState
  const data = {
    type,
    query,
  }
  room ? data.room = room : null
  variables ? data.variables = variables : null
  return rootGetters.socket.emit('query', data)
}
