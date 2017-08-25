import Notifications from 'components/Notifications'

describe('components/Notifications', () => {
  it('display messages with type', () => {
    const vm = new Vue({
      ...Notifications,
      propsData: {
        messages: [{
          type: 'warning',
          message: 'abc'
        }]
      }
    }).$mount()
    const notification = vm.$el.querySelector('.notification')
    expect(notification.classList.contains('is-warning')).toBe(true)
  })

  it('when no define type, default type is info', () => {
    const vm = new Vue({
      ...Notifications,
      propsData: {
        messages: [{
          message: 'abc'
        }]
      }
    }).$mount()
    const notification = vm.$el.querySelector('.notification')
    expect(notification.classList.contains('is-info')).toBe(true)
  })
})
