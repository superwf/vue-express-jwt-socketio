// import config from '../../../config'

export default {
  '@tags': ['regist'],
  'regist': function test (browser) {
    const devServer = browser.globals.devServerURL

    const user = {
      email: 'abc@x.com',
      password: 'abc@x.com'
    }

    browser
      .url(devServer)
      .maximizeWindow()
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('.app-header')
      .click('.app-header button.login')
      .waitForElementVisible('.login-form', 5000)
      .setValue('.login-form input[name="email"]', user.email)
      .setValue('.login-form input[name="password"]', user.password)
      .setValue('.login-form input[name="captcha"]', 'wang')
      .click('.login-form button')
      .pause(2000)
      .assert.containsText('.app-header button', user.email)
      .removeUser(user.email)
      .end()
  },
}
