import User, { cryptPassword } from '../../../server/models/user'

describe('model user', () => {
  before(done => {
    User.createDefault().then(() => done())
  })
  beforeEach(done => {
    User.truncate().then(() => done())
  })
  describe('validate', () => {
    it('validate', done => {
      const password = 'a'.repeat(50)
      const user = User.build({
        name: 'wfwf',
        password,
      })
      user.save().then(user => {
        expect(user.name).toBe('wfwf')
        expect(user.password).toBe(cryptPassword(password))
        done()
      })
    })

    it('name length should be in 1~50', done => {
      const name = 'a'.repeat(51)
      const password = 'a'.repeat(51)
      let user = User.build({
        name: '',
        password: '',
      })
      user.validate().catch(e => {
        expect(e.errors.length).toBe(2)
        return User.create({
          name,
          password: 'sdf',
        })
      }).catch(e => {
        expect(e.errors.length).toBe(1)
        expect(e.errors[0].path).toBe('name')
        return User.create({
          name: 'asfdsa',
          password,
        })
      }).catch(e => {
        expect(e.errors.length).toBe(1)
        expect(e.errors[0].path).toBe('password')
        done()
      })
    })

    it('name or password not allow null', done => {
      User.create({name: 'sdfafsd'}).catch(e => {
        expect(e.errors.length).toBe(1)
        expect(e.errors[0].path).toBe('password')
        return User.create({ password: 'sdfas' })
      }).catch(e => {
        expect(e.errors.length).toBe(1)
        expect(e.errors[0].path).toBe('name')
        done()
      })
    })
  })

  it('update', done => {
    const password = 'sadfsda'
    User.create({
      name: 'updateUser',
      password,
    }).then(user => {
      user.name = 'xxxx'
      return user.save()
    }).then(user => {
      expect(user.password).toBe(cryptPassword(password))
      return user.update({
        password: 'yyyy'
      })
    }).then(user => {
      expect(user.password).toBe(cryptPassword('yyyy'))
      done()
    })
  })
})
