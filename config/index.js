// see http://vuejs-templates.github.io/webpack for documentation.
const path = require('path')
const env = require('./env').env

const config = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report,
    jwtSecret: 'yourproductionjwtsecret',
    mysql: {
      database: 'test',
      username: 'test',
      password: 'test',
    },
  },
  development: {
    env: require('./dev.env'),
    host: 'localhost',
    port: 8080,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
    jwtSecret: 'safdasfasfdsafdasf',
    mysql: {
      database: 'test',
      username: 'test',
      password: 'test',
    },
  },
  test: {
    mysql: {
      database: 'test',
      username: 'test',
      password: 'test',
    },
  },
}

module.exports = config[env]
