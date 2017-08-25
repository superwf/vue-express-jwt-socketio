import curry from 'lodash/curry'

/* 从当前组件向上寻找第一个匹配的vue组件
 * @param Function filterFunc
 * @param Object vue instance
 * */
function getVueParent (filterFunc, vm) {
  let parent = vm.$parent
  while (parent && !filterFunc(parent)) {
    parent = parent.$parent
  }
  return parent || null
}

export default curry(getVueParent)
