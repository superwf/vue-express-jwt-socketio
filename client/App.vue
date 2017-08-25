<template lang="pug">
#app
  app-header
  app-notifications
  router-view
</template>

<script>
import AppHeader from 'views/AppHeader'
import AppNotifications from 'views/Notifications'

export default {
  name: 'app',
  components: {
    AppHeader,
    AppNotifications,
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
