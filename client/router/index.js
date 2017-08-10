import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'Home',
    component (resolve) {
      return require(['components/Home'], resolve)
    }
  }, {
    path: '/user',
    name: 'User',
    component (resolve) {
      return require(['components/User'], resolve)
    }
  }]
})
