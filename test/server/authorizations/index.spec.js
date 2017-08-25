import authorizations from '../../../server/authorizations'
import config from '../../../config'
import * as models from '../../../lib/models'
import every from 'lodash/every'

describe('authorizations', () => {
  it('admin get true', done => {
    authorizations(config.defaultUser).then(ok => {
      expect(ok).toBe(true)
      done()
    })
  })

  it('user can model: user, action: updatePassword', done => {
    authorizations({}, {
      model: models.user,
      action: 'updatePassword'
    }).then(ok => {
      expect(ok).toBe(true)
      done()
    })
  })

  it('user can not model: noModel, action: anyAction', done => {
    authorizations({}, {
      model: 'NoModel',
      action: 'anyAction'
    }).then(ok => {
      expect(ok).toBe(false)
      done()
    })
  })

  it('authorized model and actions', () => {
    return Promise.all([
      'regist',
      'updateEmail',
      'updatePassword',
    ].map(action => {
      return authorizations({}, {
        model: models.user,
        action
      })
    })).then(results => {
      expect(every(results, ok => ok === true)).toBe(true)
    })
  })
})
