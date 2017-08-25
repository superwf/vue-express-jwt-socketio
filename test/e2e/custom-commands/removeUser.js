/* 删除用户 */
const axios = require('axios')
exports.command = function (email) {
  return this.perform(function (done) {
    axios({
      method: 'DELETE',
      url: '/user',
      data: { email }
    }).then(done, done)
  })
}
