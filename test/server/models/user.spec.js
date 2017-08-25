import User, { cryptPassword } from '../../../server/models/user'
import config from '../../../config'
import { dbConnectPromise } from '../../../server/db'

describe('model user', () => {
  beforeEach(() => {
    return dbConnectPromise.then(() => {
      return User.destroy({
        where: {
          email: {
            $not: config.defaultUser.email
          }
        }
      })
    }).then(() => {
      return User.createDefault()
    })
  })
  describe('validate', () => {
    it('valid user', () => {
      const password = 'a'.repeat(50)
      const email = 'a@x.com'
      const user = User.build({
        email,
        password,
      })
      return user.save().then(user => {
        expect(user.email).toBe(email)
        expect(user.password).toBe(cryptPassword(password))
      })
    })

    it('email length should be in 5~50', done => {
      const email = 'a@c.c' + 'a'.repeat(46)
      const password = 'a'.repeat(6)
      let user = User.build({
        email: '',
        password: '',
      })
      user.validate().catch(e => {
        expect(e.errors.length).toBe(3)
        return User.create({
          email,
          password
        })
      }).catch(e => {
        expect(e.errors.length).toBe(1)
        expect(e.errors[0].path).toBe('email')
        return User.create({
          email: 'asfdsa',
          password,
        })
      }).catch(e => {
        expect(e.errors.length).toBe(1)
        expect(e.errors[0].path).toBe('email')
        done()
      })
    })

    it('email or password not allow null', done => {
      User.create({email: 'a@c.com'}).catch(e => {
        expect(e.errors.length).toBe(1)
        expect(e.errors[0].path).toBe('password')
        return User.create({ password: 'aaaaaa' })
      }).catch(e => {
        expect(e.errors.length).toBe(2)
        expect(e.errors[0].path).toBe('email')
        expect(e.errors[1].path).toBe('email')
        done()
      })
    })
  })

  it('update', done => {
    const password = 'aaaaaa'
    User.create({
      email: 'a@x.com',
      password,
    }).then(user => {
      user.email = 'b@c.com'
      return user.save()
    }).then(user => {
      expect(user.email).toBe('b@c.com')
      expect(user.password).toBe(cryptPassword(password))
      return user.update({
        password: 'yyyyyy'
      })
    }).then(user => {
      expect(user.password).toBe(cryptPassword('yyyyyy'))
      done()
    })
  })

  it('email is uniq', done => {
    User.findOne({ where: { email: config.defaultUser.email } }).then(user => {
      expect(user.email).toBe(config.defaultUser.email)
      User.create({
        email: user.email,
        password: 'sdfasdfsf'
      }).catch(e => {
        expect(e.errors.length).toBe(1)
        expect(e.errors[0].path).toBe('email')
        expect(e.errors[0].message).toBe('Email不能重复')
        done()
      })
    })
  })

  it('User.isAdmin', () => {
    expect(User.isAdmin()).toBe(false)
    expect(User.isAdmin(null)).toBe(false)
    expect(User.isAdmin(false)).toBe(false)
    expect(User.isAdmin({})).toBe(false)
    expect(User.isAdmin({ email: 'xyz@x.com' })).toBe(false)
    expect(User.isAdmin({ email: config.defaultUser.email })).toBe(true)
  })

  it('User.regist', () => {
    const user = {
      email: 'abc@c.com',
      password: 'xxxxxx'
    }
    return User.regist(user).then(u => {
      expect(u.email).toBe(user.email)
      expect(u.locked).toBe(false)
    })
  })
})
