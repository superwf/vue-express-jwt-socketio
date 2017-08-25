<template lang="pug">
.wrapper
  table.table
    slot
  pagination(:urlPrefix="urlPrefix", :currentPage="currentPage", :lastPage="lastPage", :urlBuilder="urlBuilder", modifiers="is-centered")
</template>
<script>
import Pagination from 'components/Pagination'
import config from '@/config'

export default {
  name: 'scroll-table',
  data () {
    return {
      count: 0
    }
  },
  components: {
    Pagination,
  },
  props: {
    type: {
      type: String,
      required: true,
    },
    fetchWhenMount: {
      type: Boolean,
      default: true,
    },
    urlPrefix: {
      type: String,
      required: true
    }
  },
  computed: {
    lastPage () {
      return Math.ceil(this.count / config.page.limit)
    },
    currentPage () {
      const offset = this.$route.query.offset || 0
      return Number(offset)
    },
  },
  mounted () {
    if (this.fetchWhenMount) {
      this.load()
    }
  },
  watch: {
    '$route.query': function (val) {
      this.load()
    }
  },
  methods: {
    load () {
      // console.log(this.$route.query)
      const query = {
        ...this.$route.query,
        limit: config.page.limit
      }
      query.offset = ((query.offset || 1) - 1) * query.limit
      this.$store.dispatch(this.type, query).then(res => {
        this.count = res.count
        return res
      })
    },
    urlBuilder (offset) {
      return { path: '/users', query: { ...this.$route.query, offset } }
    },
  }
}
</script>
<style lang="sass">
.wrapper
  overflow-x: auto
  overflow-y: hidden
table,
  width: 100%
.pagination
  width: 20em
  margin: 0 auto
  position: fixed
  transform: bottom .5s
  bottom: .5em
  left: 50%
  transform: translateX(-50%)
</style>
