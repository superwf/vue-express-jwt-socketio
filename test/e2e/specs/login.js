// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage
const { defaultUser } = require('../../../config').default

module.exports = {
  'login progress': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer)
      .waitForElementVisible('#app', 5000)
      .waitForElementVisible('.login', 5000)
      .setValue('.login [name="name"]', defaultUser.name)
      .setValue('.login [name="password"]', defaultUser.password)
      .click('.login button')
      .waitForElementVisible('.app-header', 5000)
      .assert.containsText('.app-header', defaultUser.name)
      .assert.containsText('.app-header button', 'Logout')
      .click('.app-header button')
      .waitForElementVisible('.login', 5000)
      .end()
  }
}
