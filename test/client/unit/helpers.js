// helpers for nextTick
export const waitForNextTick = () => {
  return new Promise(resolve => {
    Vue.nextTick(() => {
      resolve()
    })
  })
}

export const dispatchEvent = (node, eventType) => {
  const eventName = eventType === 'click' ? 'MouseEvent' : 'HTMLEvents'
  const e = document.createEvent(eventName)
  e.initEvent(eventType, true, false)
  return node.dispatchEvent(e)
}
