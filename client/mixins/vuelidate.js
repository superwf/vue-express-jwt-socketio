import propertyOf from 'lodash/propertyOf'
import modelMessages from 'lib/messages'
import reduce from 'lodash/reduce'

const messages = propertyOf(modelMessages)

export default {
  computed: {
    successClass () {
      if (this.validator) {
        return (this.$v.$dirty && !this.$v.$invalid)
      }
      return false
    },
    dangerClass () {
      if (this.validator) {
        return this.$v.$dirty && this.$v.$invalid
      }
      return false
    },
    classNames () {
      return { 'is-success': this.successClass, 'is-danger': this.dangerClass }
    },
    errors () {
      if (this.validator && this.modelName && this.$v.$error) {
        if (this.focused) {
          return []
        }
        const errors = reduce(this.$v.value, (r, v, k) => {
          if (k && k[0] !== '$' && v === false) {
            r.push(k)
          }
          return r
        }, [])
        if (errors && errors.length > 0) {
          return errors.map(k => {
            const path = `${this.modelName}.${this.name}.${k}`
            const message = messages(path)
            if (!message) {
              return `missing message text ${path} in lib/messages`
            }
            if (typeof message === 'function') {
              if (this.validator[k].args) {
                return message(...this.validator[k].args)
              }
              return message()
            }
            return message
          })
        }
      }
      return []
    }
  },
}
