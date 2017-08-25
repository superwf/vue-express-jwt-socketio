<template lang="pug">
transition-group.notifications(
  name="notification",
  tag="div",
  enter-active-class="bounceInRight",
  leave-active-class="bounceOutRight"
)
  .notification.animated(
    v-for="(message, key) in messages",
    :key="key"
    :class="[message.type ? `is-${message.type}` : 'is-info']"
  )
    | {{ message.message }}

</template>
<script>
export default {
  name: 'notifications',
  props: {
    messages: {
      type: Array,
      default: []
    }
  }
}
</script>
<style lang="sass" scoped>
@import "variables"
.notifications
  position: fixed
  right: 1em
  top: $line-height
  z-index: 100
.notification
  padding: .5em 1em
  margin-bottom: .1em
</style>
