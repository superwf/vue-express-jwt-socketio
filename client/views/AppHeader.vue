<template lang="pug">
.app-header
  h2.left Welcome
  transition(
    name="transition",
    enter-active-class="bounceIn",
    leave-active-class="bounceOut",
    mode="out-in"
  )
    button.right.animated.button.is-info.login(v-if="!me.email", @click="showLogin=!showLogin") 登录系统
    nav.right.animated(v-else)
      button.button.is-info(@click="showLogout=!showLogout") {{ me.email }}
  transition(
    name="transition",
    enter-active-class="fadeInDown",
    leave-active-class="fadeOutRight"
  )
    login-form.animated(v-if="showLogin && !me.email")
  transition(
    name="transition",
    enter-active-class="fadeInDown",
    leave-active-class="fadeOutRight"
  )
    button.animated.logout.button.is-info(v-if="showLogout", @click="logout") 退出系统
  nav.center
    router-link(to="/news") News
</template>
<script>
import LoginForm from 'views/Login'
import { mapState } from 'vuex'
import { LOGOUT } from 'lib/types'

export default {
  name: 'app-header',
  data () {
    return {
      showLogin: false,
      showLogout: false,
    }
  },
  computed: {
    ...mapState({
      me: state => state.user.me
    })
  },
  components: {
    LoginForm,
  },
  methods: {
    logout () {
      this.$store.dispatch(LOGOUT)
      this.showLogout = false
    }
  },
}
</script>
<style lang="sass" scoped>
@import "variables"
.app-header
  padding: .5em 2em
  border-bottom: 1px solid #eee
  line-height: $line-height
  position: relative
  .left, .right
    position: absolute
  .center
    width: 100%
    text-align: center
  .left
    left: 1em
  .right
    right: 1em
.login-form, .logout
  position: absolute
  right: 1em
  top: 4em
</style>
