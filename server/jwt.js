import jsonwebtoken from 'jsonwebtoken'
import bodyParser from 'body-parser'
// import cookieParser from 'cookie-parser'
import config from '../config'
import User, { cryptPassword } from './models/user'

/* @param Object express instance
 * */
export default function jwtApp (app) {
  app.use(bodyParser.json())
  // app.use(cookieParser())
  app.post(
    '/login',
    function (req, res) {
      const { name, password } = req.body
      User.findOne({ where: { name } }).then(user => {
        if (user && user.password === cryptPassword(password)) {
          const token = jsonwebtoken.sign({
            name: user.name,
            id: user.id,
          }, config.jwtSecret, {
            expiresIn: config.tokenExpiresIn
          })
          res.json({
            user: {
              id: user.id,
              name: user.name,
            },
            token
          })
        } else {
          throw new Error('user name or password not correct')
        }
      }).catch(e => {
        res.status(401)
        res.json({
          message: e.toString()
        })
      })
    }
  )
  // app.use(function (err, req, res, next) {
  //   if (err.name === 'UnauthorizedError') {
  //     res.status(401).send('no auth')
  //   } else {
  //     next()
  //   }
  // })
}
