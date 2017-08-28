import ScrollTable from 'components/ScrollTable'
import { waitForNextTick } from '../../helpers'
import Router from 'vue-router'
import makeStore from '@/store'

describe('components/ScrollTable', () => {
  it('test style', async () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const vm = new Vue({
      ...ScrollTable,
      store: makeStore(),
      propsData: {
        urlPrefix: '/users',
        type: 'user-list',
      },
      router: new Router()
    }).$mount(div)
    await waitForNextTick()
    const style = getComputedStyle(vm.$el)
    expect(style['overflow-x']).toBe('auto')
    expect(style['overflow-y']).toBe('hidden')
    vm.$destroy()
  })
})
