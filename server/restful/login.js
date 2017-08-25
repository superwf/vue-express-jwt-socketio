import jsonwebtoken from 'jsonwebtoken'
import config from '../../config'
import User, { cryptPassword } from '../models/user'

const generateToken = user => jsonwebtoken.sign({
  email: user.email,
  id: user.id,
}, config.jwtSecret, {
  expiresIn: config.tokenExpiresIn
})

/* @param Object express instance
 * */
export default app => {
  app.post(
    '/login',
    function (req, res) {
      res.header('Access-Control-Allow-Origin', '*')
      // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
      // res.header('Access-Control-Allow-Methods', 'POST,OPTIONS')
      const { email, password } = req.body
      User.findOne({ where: { email } }).then(user => {
        // 如果用户不存在则注册
        if (!user) {
          return User.create({ email, password }).then(user => {
            const token = generateToken({
              email: user.email,
              id: user.id,
            })
            res.json({
              id: user.id,
              email: user.email,
              token
            }).end()
          }).catch(err => {
            res.status(422)
            res.json({
              message: err.toString()
            })
          })
        }
        if (user.password === cryptPassword(password)) {
          if (user.locked) {
            const err = new Error('user locked')
            err.status = 423
            throw err
          }
          const token = generateToken({
            email: user.email,
            id: user.id,
          })
          res.json({
            id: user.id,
            email: user.email,
            token
          })
        } else {
          const err = new Error('user email or password not correct')
          err.status = 401
          throw err
        }
      }).catch(e => {
        res.status(e.status)
        res.json({
          message: e.toString()
        })
      })
    }
  )

  // 在测试环境清理注册用户
  if (config.env.isTest) {
    app.delete('/user', (req, res) => {
      const { email } = req.body
      console.log(email)
      User.destroy({ where: { email } }).then(number => {
        res.json({
          number
        })
      })
    })
  }
  // app.use(function (err, req, res, next) {
  //   if (err.email === 'UnauthorizedError') {
  //     res.status(401).send('no auth')
  //   } else {
  //     next()
  //   }
  // })
}
