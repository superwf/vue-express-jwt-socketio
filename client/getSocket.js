import io from 'socket.io-client'
import config from '../config'

// singlton socket instance
let socket = null

function getSocket () {
  if (socket) {
    return socket
  }
  const token = localStorage.getItem('token')
  socket = io({
    path: config.socketPath,
    reconnection: true,
    autoConnect: !!token,
    reconnectionDelay: 5000,
    // reconnectionFactor: 5000,
    transports: ['websocket', 'polling'],
    query: {
      token,
    },
    transportOptions: {
      polling: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
  socket.on('reconnect_attempt', () => {
    const token = localStorage.getItem('token')
    socket.io.opts.query = {
      token
    }
  })
  return socket
}
export default getSocket
