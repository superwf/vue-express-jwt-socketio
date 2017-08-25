<template lang="pug">
transition(
  name="fade",
  enter-active-class="fadeInRight",
  leave-active-class="fadeOutRight",
)
  .level.error-message.animated(v-show="text")
    .control-label
    .control {{ text }}
</template>
<script>
export default {
  name: 'v-input-error',
  props: {
    text: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="sass" scoped>
@import "../styles/variables"
.error-message
  position: absolute
  right: .5em
  top: 0
  line-height: 2.25
  color: fade-out($danger, 0.4)
  font-weight: bold
</style>
