/* 该模块负责接口交互restful请求
 * 默认导出函数
 * */
import axios from 'axios'
import config from 'lib/config'
import Event from 'src/event'

export const emitter = new Event()

/* 登录后活得的token */
axios.defaults.headers.common.token = localStorage.getItem('token') || ''
axios.defaults.headers.common.remember = localStorage.getItem('remember') || ''
axios.defaults.headers.common.captcha = localStorage.getItem('captcha') || ''

/* eslint-disable no-extend-native */
/* 此处只在chrome中管用，其他浏览器不能patch上去，没搞清楚原因 */
/* istanbul ignore if */
// if (typeof Promise.prototype.ensure === 'undefined') {
//   Promise.prototype.ensure = function ensure (func) {
//     this.then(func).catch(func)
//     return this
//   }
// }
/* eslint-enable */

/* 根据模型名称生成该模型的restApi的实例
 * 如果已获取token将token插入所有请求的headers中
 * @return Object restful调用实例，有get put delete post patch几个方法，调用参数参考axios文档
 * */
export const generateRest = () => {
  const baseURL = config.apiPath
  const ajax = axios.create({
    baseURL
  })

  const handleErrorCode = res => {
    if (res.data && res.data.code !== 'success') {
      const error = new Error('response code error')
      error.status = res.status
      if (res.data) {
        error.code = res.data.code
        error.data = res.data.data
        error.message = res.data.message
      }
      if (error.code === 'captcha.error') {
        emitter.emit('refresh')
      }
      throw error
    }
    /* 有时后端没有返回data，补全一下免得报错 */
    if (res.data.data === undefined) {
      res.data.data = {}
    }
    return res.data
  }

  return ['get', 'post', 'put', 'delete', 'patch'].reduce((result, method) => {
    result[method] = (...args) => {
      emitter.emit('start')
      const promise = ajax[method](...args)
      return promise.then(res => {
        emitter.emit('stop')
        try {
          return handleErrorCode(res)
        } catch (e) {
          throw e
        }
      }).catch(res => {
        emitter.emit('stop')
        /* 当返回4xx状态码时广播出去 */
        if (res.response) {
          const { status } = res.response
          if (status === 401) {
            emitter.emit('noLogin')
            // throw res
          }
          if (res.response && res.response.data && res.response.data.code) {
            handleErrorCode(res.response)
          }
        }
        if (res instanceof Error) {
          throw res
        }
      })
    }
    return result
  }, {})
}

const rest = generateRest()

export const setToken = (t) => {
  axios.defaults.headers.common.token = t
  localStorage.setItem('token', t)
}
export const setCaptcha = (t) => {
  axios.defaults.headers.common.captcha = t
  localStorage.setItem('captcha', t)
}
export const setRemember = (remember) => {
  axios.defaults.headers.common.remember = remember
  localStorage.setItem('remember', remember)
}

export default rest
