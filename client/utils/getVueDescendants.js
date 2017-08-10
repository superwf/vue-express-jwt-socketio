import curry from 'lodash/curry'

/* 返回用filterFunc过滤后的所有vue后代组件
 * @param Function, filter func, should return bool
 * @param Boolean, true means when mached, still find mached in the matched child, default is false
 * @param Object vue instance
 * */
const getVueDescendants = (filterFunc, recursive, vm) => {
  /* es6的参数默认值与curry不兼容，在lodash的issue中有提到 */
  if (recursive === undefined) {
    recursive = false
  }
  return vm.$children.reduce((result, child) => {
    if (filterFunc(child)) {
      result.push(child)
      if (!recursive) {
        return result
      }
    }
    if (child.$children.length > 0) {
      result = result.concat(getVueDescendants(filterFunc, recursive, child))
    }
    return result
  }, [])
}

export default curry(getVueDescendants)
