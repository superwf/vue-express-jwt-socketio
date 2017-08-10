<template lang="pug">
form(novalidate, @submit.prevent="loadingSubmit")
  slot
</template>
<script>
import getVueDescendants from '@/utils/getVueDescendants'
import LoadingButton from 'components/LoadingButton'

export default {
  name: 'loading-form',
  props: {
    submit: {
      type: Function,
      required: true
    },
  },
  methods: {
    loadingSubmit () {
      const promise = this.submit()
      if (promise.then) {
        const isLoadingButton = c => c.$options && c.$options.name === LoadingButton.name
        const loadingButtons = getVueDescendants(isLoadingButton, false, this)
        loadingButtons.forEach(button => {
          button.loading = true
        })
        setTimeout(() => {
          promise.finally(() => {
            loadingButtons.forEach(button => {
              button.loading = false
            })
          })
        }, 1000)
      }
    }
  }
}
</script>
