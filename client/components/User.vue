<template lang="pug">
.users
  table
    transition-group(
      name="transition",
      appear-active-class="fadeInDown",
      enter-active-class="fadeInDown",
      leave-active-class="fadeOutUp",
      tag="tbody"
    )
      tr.animated(v-for="user in users", :key="user.id")
        td id: {{ user.id }}
        td name: {{ user.name }}
        td
          button(@click="remove(user.id)") REMOVE
  form(@submit.prevent="submit")
    input(v-model="name")
    button(@click="isCreate = false") update user1 name
    button(@click="isCreate = true") create user
  .socket
    button(@click="connect") connect
    button(@click="disconnect") disconnect
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { CREATE_USER, USERS, UPDATE_USER, REMOVE_USER } from 'store/types'
import broadcast from 'mixins/broadcast'

export default {
  name: 'users',
  mixins: [broadcast],
  data () {
    return {
      name: '',
      isCreate: false,
    }
  },
  computed: {
    ...mapState({
      users (state) {
        return state.user.users
      },
    }),
    ...mapGetters(['socket']),
  },
  beforeMount () {
    this.fetchUsers()
  },
  methods: {
    ...mapActions({
      fetchUsers: USERS,
    }),
    submit () {
      if (this.isCreate) {
        this.$broadcast(CREATE_USER, {user: {
          name: this.name,
          password: 'defaultpassword'
        }})
      } else {
        this.$broadcast(UPDATE_USER, {
          id: 1,
          name: this.name,
          password: 'admin'
        })
      }
    },
    remove (id) {
      this.$broadcast(REMOVE_USER, { id })
    },
    connect () {
      this.socket.open(() => {
        console.log(1)
      })
    },
    disconnect () {
      this.socket.close()
    },
  }
}
</script>
<style lang="sass">
.users
  display: flex
  flex-wrap: wrap
  justify-content: center
  form
    flex-basis: 100%
li
  cursor: pointer
</style>
