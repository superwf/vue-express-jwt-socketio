import Vue from 'vue'
import getVueDescendants from 'utils/getVueDescendants'
import expect from 'expect'

describe.only('utils/getVueDescendants', () => {
  const compA = {
    name: 'comp-a',
    age: 1,
    template: '<span><slot></slot></span>'
  }
  const compB = {
    name: 'comp-b',
    template: '<i></i>',
    age: 2
  }
  const otherComp = {
    name: 'other-comp',
    template: '<b></b>',
    age: 3
  }

  it('get children by name', () => {
    const vm = new Vue({
      components: {
        compA,
        compB,
        otherComp
      },
      template: `<comp-a>
        <comp-b />
        <otherComp />
      </comp-a>`
    })
    var div = document.createElement('div')
    document.body.appendChild(div)
    vm.$mount(div)

    const filterCompName = c => c.$options.name && c.$options.name.startsWith('comp-')
    const children = getVueDescendants(filterCompName, true)(vm)
    expect(children.length).toBe(2)

    const childrenNotRecurve = getVueDescendants(filterCompName, false)(vm)
    expect(childrenNotRecurve.length).toBe(1)

    const filterOtherName = c => c.$options.name && c.$options.name.startsWith('other-')
    expect(getVueDescendants(filterOtherName, false, vm).length).toBe(1)

    vm.$destroy()
  })
})
