<template lang="pug">
form(@submit.stop.prevent="vSubmit")
  slot
</template>

<script>
import getVueDescendants from 'utils/getVueDescendants'
export default {
  name: 'v-form',
  props: {
    beforeSubmit: {
      type: Function
    },
    afterSubmit: {
      type: Function
    },
    model: {
      type: String
    },
    submit: {
      type: Function,
      required: true
    },
  },

  data () {
    return {
      submitButton: null
    }
  },

  computed: {
  },

  methods: {
    async vSubmit () {
      const children = this.getInvalidChildren()
      if (children.length > 0) {
        return
      }

      if (this.beforeSubmit) {
        const before = await this.beforeSubmit()
        if (!before) {
          return
        }
      }
      this.getSubmitButton()
      const promise = this.submit()
      if (!promise || !promise.then) {
        throw new Error('prop: submit, must return promise')
      }
      if (this.submitButton) {
        this.submitButton.loading = true
        const restoreLoadingButton = () => {
          this.submitButton.loading = false
        }
        promise.then(restoreLoadingButton, restoreLoadingButton)
      }
      if (this.afterSubmit) {
        promise.then(this.afterSubmit, this.afterSubmit)
      }
      return promise
    },

    values () {
      const children = getVueDescendants(vm => {
        if ('value' in vm && 'name' in vm && !vm.disabled) {
          return true
        }
        return false
      }, true, this)
      if (children) {
        return children.reduce((result, input) => {
          if (input.name) {
            result[input.name] = input.value
          }
          return result
        }, {})
      }
      return {}
    },

    getInvalidChildren () {
      return getVueDescendants(vm => {
        if ('$v' in vm && !vm.disabled) {
          vm.$v.$touch()
          return vm.$v.$invalid
        }
        return false
      }, true, this)
    },

    getSubmitButton () {
      const button = getVueDescendants(vm => vm.$options.name === 'loading-button', true, this)[0]
      if (button) {
        this.submitButton = button
      }
    }
  }
}
</script>
