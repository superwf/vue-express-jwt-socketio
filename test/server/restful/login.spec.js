import axios from 'axios'
import config from '../../../config'
import User from '../../../server/models/user'

describe('post /login', () => {
  const host = `${config.protocol}://${config.host}:${config.port}/`
  const captchaPath = `${host}captcha`
  const loginPath = `${host}login`

  it('post to login and get token', () => {
    return axios.get(captchaPath).then(r => {
      // console.log(r.data)
      return axios.post(loginPath, {
        email: config.defaultUser.email,
        password: config.defaultUser.password,
        captcha: 'wang'
      }).then(res => {
        expect(res.status).toBe(200)
        expect(res.data.email).toBe(config.defaultUser.email)
        expect('token' in res.data).toBe(true)
      })
    })
  })

  it('locked user post /login will return 423', () => {
    const user = {
      email: 'lock@lock.com',
      password: 'sfdasdf',
      locked: true
    }
    return User.destroy({ where: { email: user.email } }).then(() => {
      return User.create(user)
    }).then(() => {
      return axios.get(captchaPath).then(r => {
        // console.log(r.data)
        return axios.post(loginPath, {
          email: user.email,
          password: user.password,
          captcha: r.data.text
        }).catch(err => {
          expect(err.response.status).toBe(406)
          expect(err.response.data.message).toInclude('图片验证码错误')
        })
      })
    })
  })

  it('post wrong user, get message', async () => {
    const r = await axios.get(captchaPath)
    await axios.post(loginPath, {
      captcha: r.data.text
    }).catch(err => {
      expect(err.response.status).toBe(406)
      expect('message' in err.response.data).toBe(true)
    })
  })
})
