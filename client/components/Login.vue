<template lang="pug">
.login
  form(tabindex="1", @submit.prevent="submit")
    input(name="name", v-model="name")
    input(name="password", type="password", v-model="password")
    button(type="submit") LOGIN
</template>
<script>
import axios from 'axios'
export default {
  name: 'login',
  data () {
    return {
      name: 'admin',
      token: '',
      password: 'admin',
    }
  },
  methods: {
    submit () {
      axios.post('/login', {
        name: this.name,
        password: this.password
      }).then(data => {
        this.token = data.data.token
        axios.defaults.headers.common.Authorization = `Bearer ${this.token}`
        localStorage.setItem('token', this.token)
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
