<template lang="pug">
.users
  loading-form(:submit="create")
    input(v-model="name", placeholder="name")
    input(v-model="password", placeholder="password")
    loading-button create user
  transition-group(
    name="transition",
    tag="ul"
  )
    li(v-for="user in users", :key="user.id")
      loading-form(:submit="update(user.id)")
        label
          | name
          input(:value="user.name", :ref="`name${user.id}`")
        label
          | password
          input(:ref="`password${user.id}`")
        .actions
          loading-button UPDATE
          button(@click.prevent="remove(user.id)") Destroy
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { CREATE_USER, USERS, UPDATE_USER, DESTROY_USER } from 'lib/types'
import broadcast from 'mixins/broadcast'
import LoadingButton from 'components/LoadingButton'
import LoadingForm from 'components/LoadingForm'

export default {
  name: 'users',
  components: {
    LoadingButton,
    LoadingForm,
  },
  mixins: [broadcast],
  data () {
    return {
      name: '',
      password: '',
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
  methods: {
    fetch () {
      this.fetchUsers()
    },
    ...mapActions({
      fetchUsers: USERS,
    }),
    create () {
      return this.$broadcast(CREATE_USER, {
        name: this.name,
        password: this.password
      })
    },
    update (id) {
      return () => {
        const user = {
          id,
          name: this.$refs[`name${id}`][0].value,
        }
        const password = this.$refs[`password${id}`][0].value
        if (password) {
          user.password = password
        }
        return this.$broadcast(UPDATE_USER, user)
      }
    },
    remove (id) {
      return this.$broadcast(DESTROY_USER, id)
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
li
  padding-bottom: 20px
  transition: all 1s
.actions
  display: inline-block
// .transition-move
//   transition: all 1s
.transition-enter, .transition-leave-to
  transform: translateY(-30px)
  opacity: 0
.transition-leave-active
  position: absolute
</style>
