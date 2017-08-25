<template lang="pug">
.users
  scroll-table(:type="type", urlPrefix="/users")
    thead
      th Email
    tbody(v-if="users.rows")
      tr(v-for="user in users.rows")
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
