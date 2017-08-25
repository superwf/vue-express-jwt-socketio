import io from 'socket.io-client'
import config from '../config'
import storage from './store/storage'

// singlton socket instance
let socket = null

function getSocket (forceCreateAnother = false) {
  if (socket && !forceCreateAnother) {
    return socket
  }
  const token = storage.get('token')
  socket = io(`${config.protocol}://${config.host}:${config.port}`, {
    path: config.socketPath,
    reconnection: true,
    autoConnect: !!token,
    reconnectionDelay: 5000,
    reconnectionFactor: 5000,
    transports: ['websocket', 'polling'],
    query: {
      token,
    },
  })
  socket.on('reconnect_attempt', () => {
    const token = storage.get('token')
    socket.io.opts.query = {
      token
    }
  })
  window.socket = socket
  return socket
}
export default getSocket
