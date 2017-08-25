import Vue from 'vue'
import Router from 'vue-router'
import Home from 'views/Home'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'Home',
    component: Home,
  }, {
    path: '/news',
    name: 'News',
    component (resolve) {
      return require(['views/News'], resolve)
    }
  }],
})
