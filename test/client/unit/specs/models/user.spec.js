import expect from 'expect'
import User from '@/models/user'
import axios from 'axios'
import config from '@/config'
import * as models from 'lib/models'
import getSocket from '@/socket'

describe('models/user', () => {
  let socket
  before(done => {
    axios.post('/login', {
      ...config.defaultUser,
      captcha: 'wang'
    }).then(result => {
      socket = getSocket()
      socket.io.opts.query = {
        token: result.data.token
      }
      socket.connect()
      socket.once('connect', () => {
        done()
      })
    })
  })
  after(() => {
    socket.close()
  })
  it('test User.name', () => {
    expect(User.name).toBe(models.user)
  })

  it('test findAndCountAll', done => {
    User.findAndCountAll({ limit: 2, offset: 0 }).then(res => {
      expect('count' in res).toBe(true)
      expect('rows' in res).toBe(true)
      done()
    }, () => {
      done()
    })
  })

  it('user findAll', (done) => {
    User.findAll({ attributes: ['id', 'email', 'password'] }).then(res => {
      expect(res.length > 0).toBe(true)
      expect(Object.keys(res[0])).toEqual(['id', 'email', 'password'])
      done()
    })
  })

  it('user findAll again', (done) => {
    User.findAll({ attributes: ['id', 'email', 'password'] }).then(res => {
      expect(res.length > 0).toBe(true)
      expect(Object.keys(res[0])).toEqual(['id', 'email', 'password'])
      done()
    })
  })
})
