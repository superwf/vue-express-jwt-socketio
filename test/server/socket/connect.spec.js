import io from 'socket.io-client'
import config from '../../../config'
import { NO_AUTH, ME } from '../../../client/store/types'
import path from 'path'
import fs from 'fs'
import expect from 'expect'
import axios from 'axios'

describe('connect', () => {
  it('connect without token', done => {
    const socket = io(`http://${config.host}:${config.port}`, {
      path: '/graphql',
      reconnection: false,
      transports: ['websocket', 'polling'],
    })
    socket.on('vuex', data => {
      expect(data.type).toBe(NO_AUTH)
      socket.close()
      done()
    })
  })

  it('connect with wrong token', done => {
    const socket = io(`http://${config.host}:${config.port}`, {
      path: '/graphql',
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

  it('connect with admin', done => {
    const host = `http://${config.host}:${config.port}`
    axios.post(`${host}/login`, config.defaultUser).then(result => {
      // console.log(result)
      const p = path.resolve('./', 'client/gql/me.gql')
      const meGql = fs.readFileSync(p, 'utf8')
      const { token } = result.data
      const socket = io(`http://${config.host}:${config.port}`, {
        path: '/graphql',
        query: {
          token
        },
        transports: ['websocket', 'polling'],
      })
      socket.on('connect', () => {
        socket.emit('query', {
          type: ME,
          query: meGql,
          variables: { token }
        }, data => {
          expect(data.type).toBe(ME)
          expect(data.data.name).toBe(config.defaultUser.name)
          socket.close()
          done()
        })
      })
    })
  })
})
