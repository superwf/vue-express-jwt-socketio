import Vue from 'vue'
import expect from 'expect'
import Vuelidate from 'vuelidate'

Vue.config.productionTip = false
Vue.config.devtools = false
Vue.use(Vuelidate)
global.expect = expect
global.Vue = Vue

// require all test files (files that ends with .spec.js)
const testsContext = require.context('./specs', true, /\.spec$/)
testsContext.keys().forEach(testsContext)

// require all src files except main.js for coverage.
// you can also change this to match only the subset of files that
// you want coverage for.
const srcContext = require.context(
  '../../../client',
  true,
  /^\.\/(components|utils|mixins).\/.+\.(vue|js)$/
)
srcContext.keys().forEach(srcContext)
