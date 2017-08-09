import Vue from 'vue'

Vue.config.productionTip = false

// require all test files (files that ends with .spec.js)
const testsContext = require.context('./specs', true, /\.spec$/)
testsContext.keys().forEach(testsContext)

// require all src files except main.js for coverage.
// you can also change this to match only the subset of files that
// you want coverage for.
// https://webpack.js.org/guides/dependency-management/#require-context
const srcContext = require.context(
  '../../client',
  true,
  /^\.\/(components|utils|mixins).\/.+\.(vue|js)$/
)
// console.log(srcContext.keys())
srcContext.keys().forEach(srcContext)
