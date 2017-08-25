import Captcha from 'components/Captcha'
import config from '@/config'
import { dispatchEvent } from '../../helpers'
import makeStore from 'store/index'

describe('验证码插件', () => {
  const store = makeStore()
  it('focus时通过/captcha接口获取验证码', async () => {
    const vm = new Vue(Captcha).$mount()
    expect(vm.value).toBe('')
    expect(vm.img).toBe('')
    await vm.getCaptcha()
    expect(vm.img).toNotBe('')
    vm.$v.$touch()
    expect(vm.$v.$error).toBe(true)
    vm.value = 'a'.repeat(config.captchaSize)
    expect(vm.$v.$error).toBe(false)
  })

  it('test $on "refresh" to refresh captcha', async () => {
    const vm = new Vue({
      ...Captcha,
      store,
    }).$mount()
    const spy = expect.spyOn(vm, 'getCaptcha')
    expect(spy.calls.length).toBe(0)
    vm.emitter.$emit('captchaRefresh')
    expect(spy.calls.length).toBe(1)
    vm.$destroy()
  })

  it('test input wrapper active class', async () => {
    const vm = new Vue(Captcha).$mount()
    const wrapper = vm.$el.querySelector('.is-expanded')
    expect(wrapper.classList.contains('active')).toBe(false)
    await vm.getCaptcha()
    expect(wrapper.classList.contains('active')).toBe(true)
  })

  it('focus input only call getCaptcha once', () => {
    const vm = new Vue(Captcha).$mount()
    const spy = expect.spyOn(vm, 'getCaptcha')
    expect(spy.calls.length).toBe(0)
    const input = vm.$el.querySelector('input')
    dispatchEvent(input, 'focus')
    expect(spy.calls.length).toBe(1)
    dispatchEvent(input, 'focus')
    dispatchEvent(input, 'focus')
    expect(spy.calls.length).toBe(1)
  })

  it('click .img call getCaptcha', async () => {
    const vm = new Vue(Captcha).$mount()
    const spy = expect.spyOn(vm, 'getCaptcha').andCallThrough()
    await vm.getCaptcha()
    expect(spy.calls.length).toBe(1)
    const img = vm.$el.querySelector('.img')
    dispatchEvent(img, 'click')
    expect(spy.calls.length).toBe(2)
    dispatchEvent(img, 'click')
    expect(spy.calls.length).toBe(3)
  })
})
