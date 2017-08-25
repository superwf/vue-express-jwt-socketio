<template lang="pug">
nav.pagination(v-if="show")
  paginate(
    :pageCount="page.totalPages",
    :clickHandler="clickHandler",
    prevText="<<",
    nextText=">>",
    containerClass="pagination-list",
    :initialPage="page.pageNo",
    pageClass="pagination-link"
  )
</template>

<script>
// import Vue from 'vue'
import Paginate from 'vue-bulma-patination'

// Vue.component('paginate', paginate)
export default {
  components: {
    Paginate
  },
  props: {
    page: {
      type: Object,
      default: null
    },
    clickHandler: {
      type: Function
    }
  },
  computed: {
    show () {
      const { page } = this
      return page && page.total > 1
    }
  }
}
</script>
