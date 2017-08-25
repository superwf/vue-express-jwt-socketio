<template lang="pug">
.captcha
  .control.is-horizontal
    .control.is-grouped
      .control.is-expanded.has-icon.has-icon-right(:class="{ active: active }")
        input.input(
          name="captcha",
          v-model.trim="value",
          @focus.once="getCaptcha",
          placeholder="验证码",
          @input="$v.value.$touch",
          @focus="focused=true",
          @blur="focused=false",
          :class="classNames",
        )
        transition(
          name="transition",
          enter-active-class="bounceIn",
          leave-active-class="bounceOut",
        )
          span.animated.icon.is-small.is-right(v-if="successClass")
            i.fa.fa-check
        v-input-error(:text="(!focused && $v.$error) ? '四位验证码' : ''")
      .control.button.is-loading(v-if="loading")
      .control.img(v-if="img && !loading", v-html="img", @click="getCaptcha")
</template>
<script>
import axios from 'axios'
import config from '../../config'
import VInputError from 'components/VInputError'
import { mapGetters } from 'vuex'

export default {
  name: 'captcha',
  data () {
    return {
      value: '',
      img: '',
      loading: false,
      focused: false,
    }
  },
  components: {
    VInputError,
  },
  computed: {
    active () {
      return this.$v.$dirty || this.focused || !!this.img
    },
    successClass () {
      return this.$v.$dirty && !this.$v.$invalid
    },
    dangerClass () {
      return this.$v.$dirty && this.$v.$invalid
    },
    classNames () {
      return { 'is-success': this.successClass, 'is-danger': this.dangerClass }
    },
    ...mapGetters(['emitter']),
  },
  mounted () {
    this.emitter.$on('captchaRefresh', () => this.getCaptcha())
  },
  beforeDestroy () {
    this.emitter.$off('captchaRefresh')
  },
  validations () {
    return {
      value: {
        length (val) {
          return this.value.length === config.captchaSize
        }
      }
    }
  },
  methods: {
    getCaptcha () {
      if (!this.loading) {
        this.loading = true
        // return axios.get(`${config.protocol}://${config.host}:${config.port}/captcha`).then(res => {
        return axios.get('/captcha').then(res => {
          const { data } = res
          this.img = data.img
          this.loading = false
        }, () => {
          this.loading = false
        })
      }
    }
  }
}
</script>
<style lang="sass" scoped>
@import "variables"
.captcha
  position: relative
.is-grouped
  white-space: nowrap
  height: $line-height
  overflow: hidden
.is-expanded
  float: left
  width: 100%
  transition: width .5s
  &.active
    width: 50%
.img
  font-size: 0;
  margin-top: -2px
  display: inline-block
  cursor: pointer
.button.is-loading
  width: 50%
.fa-check
  color: $success
</style>
