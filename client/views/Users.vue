<template lang="pug">
.users
  scroll-table(:type="type", urlPrefix="/users")
    thead
      th Email
    transition-group(
      v-if="users.rows",
      name="list",
      enter-active-class="slideInUp",
      leave-active-class="slideOutDown",
      tag="tbody",
      mode="out-in",
    )
      tr.animated(v-for="user in users.rows", :key="user.id")
        td {{ user.email }}
</template>
<script>
import { USER_LIST } from 'lib/types'
import { mapState } from 'vuex'
import ScrollTable from 'components/ScrollTable'
import Pagination from 'vue-bulma-pagination'

export default {
  name: 'users',
  data () {
    return {
      page: 0,
      type: USER_LIST
    }
  },
  components: {
    ScrollTable,
    Pagination,
  },
  computed: {
    ...mapState({
      users: state => state.user.list
    }),
  },
  methods: {
    // fetchUsers () {
    //   return this.$store.dispatch(USER_LIST, this.$route.query)
    // },
    urlBuilder (page) {
      return { path: '/users', query: { ...this.$route.query, page } }
    }
  }
}
</script>
<style lang="sass" scoped>
.list-leave-to, .list-move
  position: absolute
  width: 98%
tr
  transition: transform .5s
.slideOutDown
  opacity: .2
</style>
