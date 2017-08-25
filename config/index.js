// see http://vuejs-templates.github.io/webpack for documentation.
const path = require('path')
const NODE_ENV = process.env.NODE_ENV || 'development'

const base = {
  env: {
    NODE_ENV,
    isDevelopment: NODE_ENV === 'development',
    isProduction: NODE_ENV === 'production',
    isTest: NODE_ENV === 'test',
  },
  protocol: 'http',
  host: 'localhost',
  port: 8080,
  index: path.resolve(__dirname, '../dist/index.html'),
  assetsRoot: path.resolve(__dirname, '../dist'),
  assetsSubDirectory: 'static',
  assetsPublicPath: '/',
  tokenExpiresIn: '1d',
  displaySQL: false,
  jwtSecret: 'yourproductionjwtsecret',
  sessionSecret: 'mysecret',
  notificationDuration: 3000,
  captchaSize: 4,
  captchaExpiresIn: 5 * 60000, // 5 min
  needCaptchaPaths: ['/login', '/regist'],
  socketPath: '/socket',
  defaultUser: {
    email: 'superwf@gmail.com',
    password: 'superwf',
  },
}

const config = {
  production: {
    ...base,
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: true,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report,
    mysql: {
      database: 'test',
      username: 'test',
      password: 'test',
    },
  },
  development: {
    ...base,
    autoOpenBrowser: true,
    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
    mysql: {
      database: 'vue_express',
      username: 'test',
      password: 'test',
    },
  },
  test: {
    ...base,
    port: 9080,
    proxyTable: {},
    mysql: {
      database: 'vue_express_test',
      username: 'test',
      password: 'test',
    },
  },
}

export default config[NODE_ENV]
