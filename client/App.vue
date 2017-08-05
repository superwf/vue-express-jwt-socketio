<template lang="pug">
#app
  AppHeader
  router-view
  login-form(v-if="!me")
</template>

<script>
import AppHeader from 'components/AppHeader'
import LoginForm from 'components/Login'
import { mapState } from 'vuex'
export default {
  name: 'app',
  components: {
    AppHeader,
    LoginForm,
  },
  computed: {
    ...mapState({
      me: state => state.user.me
    })
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
