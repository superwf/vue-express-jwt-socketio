import expect from 'expect'
import User, { cryptPassword } from '../../../server/models/user'

describe('model user', () => {
  beforeEach(done => {
    User.sync({ force: true }).then(r => {
      done()
    }).catch((err) => {
      console.log(err)
      done()
    })
  })
  it('validate', done => {
    const a = 'a'
    const user = User.build({
      name: 'wfwf',
      password: a.repeat(50),
    })
    user.save().then(user => {
      expect(user.name).toBe('wfwf')
      expect(user.password).toBe(cryptPassword(a.repeat(50)))
      done()
    }).catch(err => {
      console.log(err)
      done()
    })
  })
})
