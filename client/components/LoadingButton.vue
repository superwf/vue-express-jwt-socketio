<template lang="pug">
button.button(
  :disabled="_disabled",
  :class="{ 'is-loading': loading }",
  @click="click"
)
  template(v-if="loading") Loading...
  slot(v-else)
</template>
<script>
export default {
  name: 'loading-button',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    handler: {
      type: Function
    }
  },
  computed: {
    $valid () {
      return !this.disabled && !this.loading
    },
    _disabled () {
      return this.disabled || this.loading
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    click () {
      if (this.handler && this.$valid) {
        this.handler()
      }
    }
  }
}
</script>
