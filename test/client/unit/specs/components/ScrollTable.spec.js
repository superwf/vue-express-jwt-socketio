import ScrollTable from 'components/ScrollTable'

describe('components/ScrollTable', () => {
  it('test style', () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const vm = new Vue(ScrollTable).$mount(div)
    const style = getComputedStyle(vm.$el)
    expect(style['overflow-x']).toBe('auto')
    expect(style['overflow-y']).toBe('hidden')
  })
})
