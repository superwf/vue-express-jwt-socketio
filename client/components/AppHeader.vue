<template lang="pug">
transition(
  name="transition",
  enter-active-class="bounceInDown",
  leave-active-class="bounceOutUp"
)
  header.app-header.animated(v-if="me")
    span welcome {{ me.name }}
    nav
      router-link(to="/user") User
    button(@click="logout") Logout
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { ME, LOGOUT } from 'lib/types'
import storage from '@/storage'

export default {
  name: 'app-header',
  beforeMount () {
    const token = storage.get('token')
    this.fetchMe(token)
  },
  computed: {
    ...mapState({
      me: state => state.user.me
    })
  },
  methods: {
    ...mapActions({
      fetchMe: ME,
      logout: LOGOUT,
    }),
  },
}
</script>
<style scoped lang="sass">
header
  display: flex
  justify-content: space-around
  position: relative
  top: 0
  width: 100%
  padding: 10px 0
  border-bottom: 1px solid #eee
</style>
