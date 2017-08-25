import VInput from 'components/VInput'
import VForm from 'components/VForm'
import isEmail from 'validator/lib/isEmail'
import messages from 'lib/messages'
import { waitForNextTick } from '../../helpers'

describe('VInput', () => {
  it('default value and default props', () => {
    const vm = new Vue({
      ...VInput,
      propsData: {
        name: 'VName',
        label: 'VLabel',
      }
    }).$mount()
    expect(vm.value).toBe('')
    expect(vm.name).toBe('VName')
    expect(vm.label).toBe('VLabel')
    expect(vm.modelName).toBe('')
    expect(vm.type).toBe('text')
    expect(vm.validator).toBe(undefined)
    expect(vm.readonly).toBe(false)
    expect(vm.disabled).toBe(false)
    expect(vm.placeholder).toBe('')
    expect(vm.defaultValue).toBe('')
  })

  it('give it a defaultValue', () => {
    const vm = new Vue({
      ...VInput,
      propsData: {
        name: 'VName',
        label: 'VLabel',
        defaultValue: 'abc'
      }
    }).$mount()
    expect(vm.value).toBe('abc')
  })

  it('test disabled, readonly, placeholder props', done => {
    const vm = new Vue({
      data () {
        return {
          disabled: false,
          readonly: false,
          placeholder: '',
        }
      },
      components: {
        VInput
      },
      template: '<v-input ref="input" label="abc" name="def" :disabled="disabled" :readonly="readonly" :placeholder="placeholder"></v-input>'
    }).$mount()
    const { input } = vm.$refs
    expect(input.disabled).toBe(false)
    expect(input.readonly).toBe(false)
    expect(input.placeholder).toBe('')
    vm.disabled = true
    vm.readonly = true
    vm.placeholder = 'xxx'
    Vue.nextTick(() => {
      expect(input.disabled).toBe(true)
      expect(input.readonly).toBe(true)
      expect(input.placeholder).toBe('xxx')
      done()
    })
  })

  it('has model prop', () => {
    const vm = new Vue({
      ...VInput,
      propsData: {
        model: 'def',
        name: 'VName',
        label: 'VLabel',
      }
    }).$mount()
    expect(vm.modelName).toBe('def')

    const form = new Vue({
      components: {
        VInput,
        VForm,
      },
      template: `<v-form model="vform" :submit="submit">
        <v-input ref="input" name="abc" label="def">
        </v-input>
      </v-form>`,
      methods: {
        submit () {}
      }
    }).$mount()
    expect(form.$refs.input.modelName).toBe('vform')
  })

  it('define input model and get error message from lib/messages', async () => {
    const vm = new Vue({
      ...VInput,
      propsData: {
        model: 'user',
        name: 'email',
        label: 'email',
        validator: {
          type: isEmail
        }
      }
    }).$mount()
    expect(vm.errors).toEqual([])
    vm.value = 'sfds'
    vm.touch()
    await waitForNextTick()
    expect(vm.errors).toEqual([
      messages.user.email.type
    ])
  })

  it('define parent form model and get message from lib/messages', async () => {
    const length = val => val.length > 1 && val.length < 4
    length.args = [1, 4]
    const vm = new Vue({
      components: {
        VForm,
        VInput,
      },
      beforeCreate () {
        this.validator = {
          type: isEmail,
          length
        }
      },
      template: `<v-form model="user" :submit="submit">
        <v-input ref="input" name="email" :validator="validator" label="ll">
        </v-input>
      </v-form>`,
      methods: {
        submit () {}
      }
    }).$mount()
    const { input } = vm.$refs
    expect(input.errors).toEqual([])
    input.value = 'abcccom'
    input.touch()
    await waitForNextTick()
    expect(input.errors).toEqual([
      messages.user.email.type,
      messages.user.email.length(1, 4)
    ])
  })

  it('test classNames when success and has errors', async () => {
    const vm = new Vue({
      ...VInput,
      propsData: {
        model: 'user',
        name: 'email',
        label: 'email',
        validator: {
          type: isEmail
        }
      }
    }).$mount()
    expect(vm.classNames).toEqual({ 'is-success': false, 'is-danger': false })
    vm.value = 'sfds'
    vm.touch()
    await waitForNextTick()
    expect(vm.classNames).toEqual({ 'is-success': false, 'is-danger': true })
    vm.value = 'abc@c.com'
    await waitForNextTick()
    expect(vm.classNames).toEqual({ 'is-success': true, 'is-danger': false })
  })
})
