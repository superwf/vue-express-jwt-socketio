import axios from 'axios'
import config from '../../../config'

describe('get /captcha', () => {
  const host = `${config.protocol}://${config.host}:${config.port}/`
  const captchaPath = `${host}captcha`
  const loginPath = `${host}login`

  it('get /captcha', () => {
    return axios.get(captchaPath).then(res => {
      expect(res.status).toBe(200)
      expect('img' in res.data).toBe(true)
    })
  })

  it('post wrong captcha, get message', () => {
    return axios.post(loginPath, {
      email: 'sss@x.com',
      password: 'sss@x.com',
      captcha: 'sss@x.com',
    }).catch(err => {
      expect(err.response.status).toBe(406)
      expect(err.response.data.message).toBe('图片验证码错误')
    })
  })

  it('only captcha', () => {
    return axios.post(loginPath, {
      captcha: 'wang',
    }).catch(err => {
      expect(err.response.status).toBe(422)
      // expect(err.response.data.message).toBe('图片验证码错误')
    })
  })
})
