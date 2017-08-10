<template lang="pug">
button(:disabled="loading")
  template(v-if="loading") Loading...
  slot(v-else)
</template>
<script>
export default {
  name: 'loading-button',
  data () {
    return {
      loading: false
    }
  },
}
</script>
