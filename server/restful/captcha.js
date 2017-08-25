import svgCaptcha from 'svg-captcha'
import config from '../../config'

export default app => {
  app.get('/captcha', (req, res) => {
    const captcha = svgCaptcha.create({
      ignoreChars: '10lLoOiI',
      size: config.captchaSize,
      height: 36
    })
    // res.header('Content-Type', 'image/svg+xml')
    const data = {
      img: captcha.data,
    }
    req.session.captcha = captcha.text
    if (process.env.NODE_ENV === 'test') {
      data.text = captcha.text
    }
    res.json(data).end()
  })

  app.use((req, res, next) => {
    if (req.method !== 'GET' && config.needCaptchaPaths.indexOf(req.path) > -1) {
      const { captcha } = req.body || ''
      const sessionCaptcha = req.session.captcha || ''
      // for test env, use 'wang' as awalys valid captcha
      if (config.env.isTest && captcha === 'wang') {
        return next()
      }
      if (sessionCaptcha.toLowerCase() !== captcha.toLowerCase()) {
        res.status(406)
        res.json({
          message: '图片验证码错误'
        }).end()
      } else {
        next()
      }
    } else {
      next()
    }
  })
}
