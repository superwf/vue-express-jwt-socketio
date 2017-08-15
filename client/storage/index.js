// make api same with Map
export default {
  get (key) {
    return localStorage.getItem(key)
  },
  set (key, value) {
    return localStorage.setItem(key, value)
  },
  delete (key) {
    return localStorage.removeItem(key)
  }
}
