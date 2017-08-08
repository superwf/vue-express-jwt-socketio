<template lang="pug">
#app
  app-header
  app-errors
  router-view(v-if="me")
  login-form
  socket-reconnect
</template>

<script>
import AppHeader from 'components/AppHeader'
import AppErrors from 'components/AppErrors'
import SocketReconnect from 'components/SocketReconnect'
import LoginForm from 'components/Login'
import { mapState } from 'vuex'
export default {
  name: 'app',
  components: {
    AppHeader,
    AppErrors,
    SocketReconnect,
    LoginForm,
  },
  computed: {
    ...mapState({
      me: state => state.user.me
    })
  },
}
</script>

<style lang="sass">
@import "style/animate.css";
@import "style/main.sass";

#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
html, body
  height: 100%
  width: 100%
  margin: 0
  overflow: hidden
</style>
