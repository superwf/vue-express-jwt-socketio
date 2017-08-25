import io from 'socket.io-client'
import config from '../../../config'
import { NO_AUTH, ME } from '../../../lib/types'
import axios from 'axios'
import { user } from '../../../lib/models'
import User from '../../../server/models/user'

describe('test socket connect', () => {
  it('without token', done => {
    const socket = io(`http://${config.host}:${config.port}`, {
      path: config.socketPath,
      reconnection: false,
      transports: ['websocket', 'polling'],
    })
    socket.on('vuex', data => {
      expect(data.type).toBe(NO_AUTH)
      socket.close()
      done()
    })
  })

  it('with wrong token', done => {
    const socket = io(`http://${config.host}:${config.port}`, {
      path: config.socketPath,
      reconnection: false,
      query: {
        token: 'sadfasdfasdfa4322348gdfx',
      },
      transports: ['websocket', 'polling'],
    })
    socket.on('vuex', data => {
      expect(data.type).toBe(NO_AUTH)
      socket.close()
      done()
    })
  })

  it(`with admin user ${config.defaultUser.email}`, done => {
    User.createDefault().then(() => {
      const host = `http://${config.host}:${config.port}`
      axios.post(`${host}/login`, {
        email: config.defaultUser.email,
        password: config.defaultUser.password,
        captcha: 'wang'
      }).then(result => {
        const { token } = result.data
        const socket = io(`http://${config.host}:${config.port}`, {
          path: config.socketPath,
          query: {
            token
          },
          transports: ['websocket', 'polling'],
        })
        socket.on('connect', () => {
          socket.emit('modelCall', {
            model: user,
            action: 'me',
            variables: [token]
          }, (_, data) => {
            expect(data.email).toBe(config.defaultUser.email)
            socket.close()
            done()
          })
        })
      })
    })
  })
})
