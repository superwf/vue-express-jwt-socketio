import { mapState, mapGetters } from 'vuex'
import { ROOM } from 'lib/types'

export default {
  computed: {
    ...mapGetters({
      $socket: 'socket'
    }),
    ...mapState(['room', 'currentRoom'])
  },
  beforeMount () {
    // use route name as room
    const room = this.$route.matched[0].name
    if (room) {
      this.$store.commit(ROOM, room)
    } else {
      this.$store.commit(ROOM, null)
    }
    if (this.fetch) {
      this.fetch()
    }
  },
  mounted () {
    if (this.room && !this.currentRoom) {
      this.$socket.emit('join', this.room)
    }
  },
  beforeDestroy () {
    if (this.room && this.currentRoom) {
      this.$socket.emit('leave', this.room)
    }
  },
  methods: {
    // broadcast only in room
    $broadcast (...args) {
      return this.$store.dispatch(...args)
    }
  }
}
