<template lang="pug">
header
  button(v-if="me", @click="logout") Logout
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
