<template lang="pug">
transition(
  name="transition",
  enter-active-class="zoomIn",
  leave-active-class="zoomOut",
)
  .socket-reconnect.animated(v-if="token && initialized && !connected")
    .content
      p 您服务器连接已断开，无法进行操作
      p(v-if="socketError") 您的服务器连接错误，请稍后再试
      button(@click="connect") 重新连接
    .mask
</template>
<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'socket-reconnect',
  computed: {
    ...mapState(['connected', 'socketError', 'initialized']),
    ...mapGetters(['socket']),
    ...mapState({
      token: state => state.user.token,
    }),
  },
  methods: {
    connect () {
      this.socket.open()
    }
  }
}
</script>
<style lang="sass" scoped>
.socket-reconnect
  position: absolute
  top: 0
  width: 100%
  height: 100%
.content
  position: relative
  z-index: 100
  background-color: white
  padding: 2em
  width: 50%
  left: 25%
  top: 30%
</style>
