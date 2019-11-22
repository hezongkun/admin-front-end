import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'
console.log(process.env)
// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
  timeout: 6000 // 请求超时时间
})

const err = (error) => {
  console.log(error)
  if (error.response) {
    const data = error.response.data
    const status = error.response.status
    const token = Vue.ls.get(ACCESS_TOKEN)

    switch (status) {
      case 200:
        break
      case 401:
        notification.error({
          message: '授权失败',
          description: '授权失败，请重新登录'
        })
        if (token) {
          store.dispatch('Logout').then(() => {
            // setTimeout(() => {
            //   window.location.reload()
            // }, 600)
          })
        }
        break
      case 403:
        notification.error({
          message: 'Forbidden',
          description: data.error
        })
        break
      case 422:
        notification.error({
          message: '表单验证失败',
          description: data.error
        })
        break
      case 500:
        notification.error({
          message: '操作失败',
          description: data.error
        })
        break
      default:
        notification.error({
          message: '服务器错误',
          description: data.error
        })
        break
    }
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers['authorization'] = `bearer ${token}` // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  // const csrftoken = 'mD8_6iTKSyg6LZsb1cNI4aU7'
  // if (csrftoken) {
  //   config.headers['x-csrf-token'] = csrftoken // 让每个请求携带自定义 token 请根据实际情况自行修改
  // }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  return response.data
}, err)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
