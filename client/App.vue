<template lang="pug">
#app
  app-header
  app-notifications
  transition(
    name="router-view",
    enter-active-class="zoomIn",
    leave-active-class="zoomOut",
    mode="out-in",
  )
    router-view.animated(v-if="me.email")
</template>

<script>
import AppHeader from 'views/AppHeader'
import AppNotifications from 'views/Notifications'
import { mapState } from 'vuex'

export default {
  name: 'app',
  components: {
    AppHeader,
    AppNotifications,
  },
  computed: {
    ...mapState({
      me (state) {
        return state.user.me
      },
    })
  },
}
</script>

<style lang="sass">
@import "~bulma"

@import "~animate.css"
.animated
  animation-duration: .5s

$fa-font-path: '~font-awesome/fonts/'
@import "~font-awesome/scss/font-awesome"

html
  font-family: 'Microsoft Yahei', Avenir, Helvetica, Arial, 'sans-serif'
html, body, #app
  height: 100%
</style>
