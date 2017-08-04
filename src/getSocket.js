import io from 'socket.io-client'

// singlton socket instance
let socket = null

async function getSocket () {
  if (socket) {
    return Promise.resolve(socket)
  }
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('token')
    socket = io({
      path: '/graphql',
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
    socket.on('connect', () => {
      resolve(socket)
    })
    socket.on('connect_error', err => {
      reject(err)
    })
  })
}
export default getSocket
