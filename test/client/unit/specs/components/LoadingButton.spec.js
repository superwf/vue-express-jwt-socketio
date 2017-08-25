import LoadingButton from 'components/LoadingButton'
import { waitForNextTick, dispatchEvent } from '../../helpers'

describe('components/LoadingButton', () => {
  it('test default props', async () => {
    const vm = new Vue(LoadingButton).$mount()
    expect(vm.disabled).toBe(false)
    expect(vm.loading).toBe(false)
    expect(vm.$el.disabled).toBe(false)
    vm.loading = true
    await waitForNextTick()
    expect(vm.$el.disabled).toBe(true)
  })

  it('set disabled props true', () => {
    const vm = new Vue({
      ...LoadingButton,
      propsData: {
        disabled: true
      }
    }).$mount()
    expect(vm.disabled).toBe(true)
    expect(vm.$el.disabled).toBe(true)
  })

  it('test handler, when disabled, click will not trigger handler', () => {
    const spy = expect.createSpy()
    const vm = new Vue({
      ...LoadingButton,
      propsData: {
        handler: spy,
      }
    }).$mount()
    expect(spy.calls.length).toBe(0)
    dispatchEvent(vm.$el, 'click')
    expect(spy.calls.length).toBe(1)
    dispatchEvent(vm.$el, 'click')
    expect(spy.calls.length).toBe(2)

    // when disabled, handler will not trigger
    vm.loading = true
    dispatchEvent(vm.$el, 'click')
    expect(spy.calls.length).toBe(2)
    spy.restore()
  })
})
