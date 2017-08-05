<template lang="pug">
transition(
  name="transition",
  enter-active-class="bounceInDown",
  leave-active-class="bounceOutUp"
)
  header.animated(v-if="me")
    span welcome {{ me.name }}
    button(@click="logout") Logout
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { ME, LOGOUT } from 'store/types'
export default {
  name: 'app-header',
  beforeMount () {
    this.fetchMe()
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
</style>
