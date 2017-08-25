<template lang="pug">
.v-input
  .control.is-horizontal
    .control-label
      label.label(v-if="label") {{ label }}
      .control.is-grouped
        p.control.is-expanded.has-icon.has-icon-right
          input.input(
            v-if="type === 'text'",
            type="text",
            :name="name",
            ref="input",
            v-model.trim="value",
            :disabled="disabled",
            :readonly="readonly",
            :placeholder="placeholder",
            @input="touch",
            @focus="onFocus",
            @blur="onBlur",
            :class="classNames",
          )
          input.input(
            v-if="type === 'password'",
            type="password",
            :name="name",
            ref="input",
            v-model.trim="value",
            :disabled="disabled",
            :readonly="readonly",
            :placeholder="placeholder",
            @input="touch",
            @focus="onFocus",
            @blur="onBlur",
            :class="classNames",
          )
          textarea.textarea(
            v-if="type === 'textarea'",
            :name="name",
            ref="input",
            v-model.trim="value",
            :disabled="disabled",
            :readonly="readonly",
            :placeholder="placeholder",
            @input="touch",
            @focus="onFocus",
            @blur="onBlur",
            :class="classNames",
          )
          transition(
            name="transition",
            enter-active-class="bounceIn",
            leave-active-class="bounceOut",
          )
            span.animated.icon.is-small.is-right(v-if="successClass")
              i.fa.fa-check
  v-input-error(:text="errors[0]")
</template>
<script>
import getVueParent from 'utils/getVueParent'
import vuelidate from 'mixins/vuelidate'
import VInputError from 'components/VInputError'

export default {
  name: 'v-input',
  mixins: [vuelidate],
  components: {
    VInputError,
  },
  data () {
    return {
      value: this.defaultValue,
      // for get text from lib/messages
      modelName: this.model,
      focused: false,
    }
  },
  props: {
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
    },
    model: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    defaultValue: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    validator: {
      type: Object,
    },
  },
  mounted () {
    if (!this.model) {
      const parent = getVueParent(vm => vm.model, this)
      if (parent && parent.model) {
        this.modelName = parent.model
      }
    }
  },
  validations () {
    const { validator } = this
    if (validator) {
      return {
        value: validator
      }
    }
    return {}
  },
  methods: {
    touch (...args) {
      if (this.validator) {
        this.$v.value.$touch(...args)
      }
    },
    onFocus () {
      this.focused = true
    },
    onBlur () {
      this.focused = false
    }
  }
}
</script>
<style lang="sass" scoped>
@import "../styles/variables"
.v-input
  position: relative
  overflow: hidden
.fa-check
  color: $success
</style>
