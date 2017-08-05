<template lang="pug">
.login
  form(tabindex="1", @submit.prevent="submit")
    input(name="name", v-model="name")
    input(name="password", type="password", v-model="password")
    button(type="submit") LOGIN
</template>
<script>
import { mapActions } from 'vuex'
import { isDevelopment } from '../../config/env'
import config from '../../config'
import { LOGIN } from 'store/types'

export default {
  name: 'login',
  data () {
    return isDevelopment ? config.defaultUser : {
      name: '',
      password: '',
    }
  },
  methods: {
    ...mapActions({
      login: LOGIN
    }),
    submit () {
      this.login({
        name: this.name,
        password: this.password
      })
    },
  }
}
</script>
<style lang="sass" scoped>
.login, form
  display: flex
  justify-content: center
form
  flex-wrap: wrap
  align-items: center
  padding: 20px
  height: 200px
  width: 400px
  border-radius: 5px
  box-shadow: 0 0 0 10000px rgba(30, 30, 30, 0.5)
input
  flex-basis: 100%
</style>
