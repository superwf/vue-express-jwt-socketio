<template lang="pug">
transition(
  name="transition",
  appear-active-class="bounceInRight",
  enter-active-class="bounceInRight",
  leave-active-class="bounceOutRight"
)
  .errors.animated(v-if="show", tabindex="100", ref="el")
    p(v-for="e in errors") {{e.message}}
    .mask(@click="hide")
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'app-errors',
  computed: {
    ...mapState({
      errors: state => state.errors
    }),
  },
  data () {
    return {
      show: false
    }
  },
  // mounted () {
  //   this.$refs.el.focus()
  // },
  watch: {
    errors (val) {
      if (val.length > 0) {
        this.show = true
      }
    }
  },
  methods: {
    hide () {
      this.show = false
    }
  }
}
</script>
<style lang="sass" scoped>
.errors
  position: absolute
  top: 20px
  right: 10px
  width: auto
p
  margin: 0
  position: relative
  z-index: 1
  padding: 5px
  background-color: white
</style>
