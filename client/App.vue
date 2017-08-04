<template lang="pug">
#app
  router-view
  login-form
</template>

<script>
import LoginForm from 'components/Login'
import { mapActions } from 'vuex'
import { ME } from 'store/types'
export default {
  name: 'app',
  components: {
    LoginForm,
  },
  beforeMount () {
    this.me()
  },
  methods: {
    ...mapActions({
      me: ME
    })
  }
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
