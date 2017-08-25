import config from '../../../config'

export default {
  'visit home page': function test (browser) {
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer)
      .maximizeWindow()
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('.app-header')
      .assert.containsText('h2', 'Welcome')
      .assert.elementNotPresent('.login-form')
      .click('.app-header button.login')
      .waitForElementVisible('.login-form', 5000)
      .setValue('.login-form input[name="email"]', config.defaultUser.email)
      .setValue('.login-form input[name="password"]', 'xxxxxx')
      // test env only, valid captcha
      .setValue('.login-form input[name="captcha"]', 'wang')

      .click('.login-form button')
      .waitForElementVisible('.notifications', 5000)
      .clearValue('.login-form input[name="password"]')
      .setValue('.login-form input[name="password"]', config.defaultUser.password)
      .click('.login-form button')
      .waitForElementNotPresent('.login-form', 1000)
      .pause(1000)
      .assert.containsText('.app-header button', config.defaultUser.email)
      .click('.app-header button')
      .waitForElementVisible('.logout', 5000)
      .pause(1000)
      .click('.logout')
      .pause(1000)
      .assert.containsText('.app-header button', '登录系统')
      .end()
  },
}
