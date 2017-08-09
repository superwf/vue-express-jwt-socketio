<template lang="pug">
.users
  form(@submit.prevent="submit")
    input(v-model="name")
    // button(@click="isCreate = false") update user1 name
    button(@click="isCreate = true") create user
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
  }
}
</script>
<style lang="sass">
table, .users
  margin-top: 20px
.users
  display: flex
  flex-wrap: wrap
  justify-content: center
  form
    flex-basis: 100%
td
  padding-bottom: 20px
li
  cursor: pointer
</style>
