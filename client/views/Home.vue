<template lang="pug">
.home
  // button(@click="removeUser") removeUser
</template>
<script>
import axios from 'axios'
export default {
  name: 'home',
  methods: {
    removeUser () {
      return axios({
        method: 'DELETE',
        url: '/user',
        data: { email: 'xys@xc.oom' }
      })
    }
  }
}
</script>
<style lang="sass" scoped>
</style>
