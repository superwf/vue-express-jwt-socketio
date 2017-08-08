import { mapGetters } from 'vuex'
import { ROOM } from 'store/types'

export default {
  computed: {
    ...mapGetters({
      $socket: 'socket',
      room: 'room'
    }),
  },
  beforeMount () {
    // use route name as room
    const room = this.$route.matched[0].name
    if (room) {
      this.$store.commit(ROOM, room)
    } else {
      this.$store.commit(ROOM, null)
    }
  },
  mounted () {
    if (this.room) {
      this.socket.emit('join', this.room)
    }
  },
  beforeDestroy () {
    if (this.room) {
      this.socket.emit('leave', this.room)
    }
  },
  methods: {
    // broadcast only in room
    $broadcast (...args) {
      args.push(this.room)
      this.$store.dispatch(...args)
    }
  }
}
