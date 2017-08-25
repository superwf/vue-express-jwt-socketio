const length = label => (min, max) => `${label}长度${min}-${max}`
const required = '必须填写'

export default {
  user: {
    email: {
      required,
      type: '必须是合法的Email格式',
      length: length('Email')
    },
    password: {
      required,
      length: length('密码')
    }
  }
}
