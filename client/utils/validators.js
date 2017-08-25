export const length = (min, max) => {
  const func = val => {
    if (min === undefined) {
      return val.length <= max
    }
    if (max === undefined) {
      return val.length >= min
    }
    return val.length >= min && val.length <= max
  }
  func.args = [min, max]
  return func
}
