// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import generateStore from './store'

Vue.config.productionTip = false

generateStore().then(store => {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    store,
    // template: '<App/>',
    render: h => h(App)
    // components: { App }
  })
})
