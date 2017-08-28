import Vue from 'vue'
import Router from 'vue-router'
import Home from 'views/Home'
import getSocket from '@/socket'

Vue.use(Router)

const router = new Router({
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
  }, {
    path: '/users',
    name: 'Users',
    component (resolve) {
      return require(['views/Users'], resolve)
    }
  }],
})

// switch room when route changing
const socket = getSocket()
router.beforeEach((to, from, next) => {
  if (to.name === from.name) {
    return next()
  }
  if (socket.io.readyState === 'open') {
    if (to.name) {
      socket.emit('join', to.name)
    }
    if (from.name) {
      socket.emit('leave', from.name)
    }
  }
  next()
})

export default router
