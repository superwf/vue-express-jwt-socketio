<template lang="pug">
notifications(:messages="errors")
</template>
<script>
import config from '@/config'
import { SHIFT_ERROR } from 'lib/types'
import Notifications from 'components/Notifications'
import { mapState } from 'vuex'

export default {
  name: 'app-notifications',
  components: {
    Notifications
  },
  computed: {
    ...mapState(['errors'])
  },
  watch: {
    errors () {
      this.shiftError()
    }
  },
  methods: {
    shiftError () {
      if (this.errors.length > 0) {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.$store.commit(SHIFT_ERROR)
          this.shiftError()
        }, config.notificationDuration)
      }
    },
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  },
}
</script>
