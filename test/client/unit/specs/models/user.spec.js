import expect from 'expect'
import User from '@/models/user'
import axios from 'axios'
import config from '@/config'
import * as models from 'lib/models'
import getSocket from '@/socket'

describe('models/user', () => {
  it('test User.name', () => {
    expect(User.name).toBe(models.user)
  })

  it('user findAll', (done) => {
    axios.post('/login', {
      ...config.defaultUser,
      captcha: 'wang'
    }).then(result => {
      expect(result.status).toBe(200)
      expect(result.data.email).toBe(config.defaultUser.email)
      expect(typeof result.data.token).toBe('string')
      const socket = getSocket()
      socket.io.opts.query = {
        token: result.data.token
      }
      socket.connect()
      socket.on('connect', () => {
        User.findAll({ attributes: ['id', 'email', 'password'] }).then(res => {
          expect(res.length > 0).toBe(true)
          expect(Object.keys(res[0])).toEqual(['id', 'email', 'password'])
          done()
        })
      })
    })
  })
})
