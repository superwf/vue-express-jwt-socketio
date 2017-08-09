import config from '../../../config'
import expect from 'expect'
import axios from 'axios'

describe.only('test login', () => {
  const host = `http://${config.host}:${config.port}/login`
  it('login with wrong params', done => {
    axios.post(host, {}).catch(e => {
      expect(e.response.status).toBe(401)
      done()
    })
  })

  it('login with wrong user or password', done => {
    axios.post(host, {
      name: 'sdfasfd',
      password: 'sdfasfd',
    }).catch(e => {
      expect(e.response.status).toBe(401)
      done()
    })
  })

  it('login with right user and get user and token', done => {
    axios.post(host, config.defaultUser).then(result => {
      expect(result.status).toBe(200)
      expect(result.data.user.name).toBe(config.defaultUser.name)
      expect(typeof result.data.token).toBe('string')
      done()
    })
  })
})
