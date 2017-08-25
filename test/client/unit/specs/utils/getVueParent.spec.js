import Vue from 'vue'
import getVueParent from 'utils/getVueParent'

describe('utils/getVueParent', () => {
  const SectionComp = {
    name: 'section-comp',
    template: '<section><slot></slot></section>'
  }

  const DivComp = {
    name: 'div-comp',
    template: '<div><slot></slot></div>'
  }
  const PComp = {
    name: 'p-comp',
    template: '<p><slot></slot></p>'
  }
  const SpanComp = {
    name: 'span-comp',
    template: '<span><slot></slot></span>'
  }

  const Comp = {
    components: {
      SectionComp,
      DivComp,
      PComp,
      SpanComp
    },

    template: `<section-comp>
    <div-comp>
    <p-comp>
    <span-comp ref="span">
    </span-comp>
    </p-comp>
    </div-comp>
    </section-comp>`
  }

  it('find parent by name filter', () => {
    const vm = new Vue(Comp)
    vm.$mount()
    const span = vm.$refs.span

    const startsWith = str => v => v.$options.name.startsWith(str)

    const div = getVueParent(startsWith('div'), span)
    expect(div.$options.name).toBe('div-comp')

    const section = getVueParent(startsWith('section'), span)
    expect(section.$options.name).toBe('section-comp')

    const p = getVueParent(startsWith('p'), span)
    expect(p.$options.name).toBe('p-comp')
  })
})
