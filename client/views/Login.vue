<template lang="pug">
v-form.login-form(model="user", :submit="login", ref="form")
  .notification.is-warning(v-if="loginError") {{ loginError }}
  v-input(
    placeholder='邮箱',
    name="email",
    ref="email",
    :defaultValue="email",
    :validator="validator.email",
  )
  v-input(
    placeholder='密码',
    name="password",
    :defaultValue="password",
    type="password",
    :validator="validator.password",
  )
  captcha-input(ref="captcha")
  loading-button.is-success 登录/注册
</template>
<script>
import { required, email } from 'vuelidate/lib/validators'
import VForm from 'components/VForm'
import VInput from 'components/VInput'
import LoadingButton from 'components/LoadingButton'
import { length } from 'utils/validators'
import { LOGIN } from 'lib/types'
import { mapState } from 'vuex'
import CaptchaInput from 'components/Captcha'
import config from '@/config'

export default {
  name: 'app-login',
  data () {
    if (config.env.isDevelopment) {
      return {
        email: config.defaultUser.email,
        password: config.defaultUser.password,
      }
    } else {
      return {
        email: '',
        password: '',
      }
    }
  },
  components: {
    VForm,
    VInput,
    CaptchaInput,
    LoadingButton,
  },
  computed: {
    ...mapState({
      loginError: state => state.user.loginError
    })
  },
  beforeCreate () {
    this.validator = {
      email: {
        required,
        type: email,
      },
      password: {
        required,
        length: length(6, 50),
      }
    }
  },
  mounted () {
    this.$refs.email.$refs.input.focus()
  },
  methods: {
    login () {
      const { form, captcha } = this.$refs
      return this.$store.dispatch(LOGIN, {
        ...form.values(),
        captcha: captcha.value
      })
    }
  }
}
</script>
<style lang="sass" scoped>
.login-form
  width: 20em
  margin-left: auto
  margin-right: auto
button
  width: 100%
.notification
  padding: 5px
  margin: 0
</style>
