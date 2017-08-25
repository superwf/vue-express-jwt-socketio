import VForm from 'components/VForm'
import VInput from 'components/VInput'
import isEmail from 'validator/lib/isEmail'
import LoadingButton from 'components/LoadingButton'
import { dispatchEvent, waitForNextTick } from '../../helpers'

describe('components/VForm', () => {
  it('submit', () => {
    const spy = expect.createSpy().andCall(() => {
      return Promise.resolve()
    })
    const vm = new Vue({
      ...VForm,
      propsData: {
        submit: spy
      }
    }).$mount()
    expect(spy.calls.length).toBe(0)
    dispatchEvent(vm.$el, 'submit')
    expect(spy.calls.length).toBe(1)
  })

  it('when beforeSubmit get false, submit will not run', async () => {
    let beforeResult = false
    const beforeSubmit = expect.createSpy().andCall(() => {
      return Promise.resolve(beforeResult)
    })
    const submit = expect.createSpy().andCall(() => Promise.resolve())
    const afterSubmit = expect.createSpy()
    const vm = new Vue({
      ...VForm,
      propsData: {
        beforeSubmit,
        afterSubmit,
        submit,
      }
    }).$mount()
    await dispatchEvent(vm.$el, 'submit')
    expect(beforeSubmit.calls.length).toBe(1)
    expect(submit.calls.length).toBe(0)
    expect(afterSubmit.calls.length).toBe(0)

    beforeResult = true
    await dispatchEvent(vm.$el, 'submit')
    expect(beforeSubmit.calls.length).toBe(2)
    expect(submit.calls.length).toBe(1)
    await Promise.resolve()
    expect(afterSubmit.calls.length).toBe(1)
  })

  it('when VForm has LoadingButton, auto add loading and remove loading before and after submit', async () => {
    let _resolve
    const submit = expect.createSpy().andCall(() => {
      return new Promise(resolve => {
        _resolve = resolve
      })
    })
    const vm = new Vue({
      components: {
        VForm,
        LoadingButton,
      },
      methods: {
        submit,
      },
      template: `<v-form ref="form" :submit="submit">
        <loading-button ref="button"></loading-button>
      </v-form>`
    }).$mount()
    const { button, form } = vm.$refs
    expect(button.loading).toBe(false)
    dispatchEvent(form.$el, 'submit')
    expect(button.loading).toBe(true)
    await _resolve()
    expect(button.loading).toBe(false)
  })

  it('has model prop', () => {
    const vm = new Vue({
      ...VForm,
      propsData: {
        model: 'User',
        submit: function () {}
      }
    }).$mount()
    expect(vm.model).toBe('User')
  })

  it('when has child components those have $error and non disabled, no submit', async () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const submit = expect.createSpy().andCall(() => {
      return Promise.resolve()
    })
    const vm = new Vue({
      data () {
        return {
          emailDisabled: false
        }
      },
      components: {
        VForm,
        VInput,
        LoadingButton,
      },
      beforeCreate () {
        this.validator = {
          email: {
            type: isEmail
          }
        }
      },
      methods: {
        submit,
      },
      template: `<v-form model="user" :submit="submit">
        <v-input ref="input" label="email" name="email" :validator="validator.email" :disabled="emailDisabled"></v-input>
        <loading-button ref="button">submit</loading-button>
      </v-form>`
    }).$mount(div)
    const { input, button } = vm.$refs
    input.value = 'abcc.com'
    dispatchEvent(button.$el, 'click')
    expect(submit.calls.length).toBe(0)
    input.value = 'abc@c.com'
    dispatchEvent(button.$el, 'click')
    expect(submit.calls.length).toBe(1)

    input.value = 'abcc.com'
    vm.emailDisabled = true
    // here need to wait nextTick and the 'submit' return promise resolve
    await waitForNextTick()
    await Promise.resolve()

    dispatchEvent(button.$el, 'click')
    expect(submit.calls.length).toBe(2)
    vm.$destroy()
  })

  it('test values computed prop', async () => {
    const submit = expect.createSpy().andCall(() => {
      return Promise.resolve()
    })
    const vm = new Vue({
      data () {
        return {
          emailDisabled: false
        }
      },
      components: {
        VForm,
        VInput,
      },
      methods: {
        submit,
      },
      template: `<v-form model="user" :submit="submit" ref="form">
        <v-input label="email" :disabled="emailDisabled" name="email" ref="email"></v-input>
        <v-input label="name" name="name" ref="name"></v-input>
      </v-form>`
    }).$mount()
    await waitForNextTick()
    const { form, email, name } = vm.$refs
    expect(form.values()).toEqual({
      email: '',
      name: ''
    })
    email.value = 'a@c.com'
    name.value = 'cccc'
    expect(form.values()).toEqual({
      email: email.value,
      name: name.value
    })
    vm.emailDisabled = true
    await waitForNextTick()
    expect(form.values()).toEqual({
      name: name.value
    })
    vm.$destroy()
  })
})
