import Axios from 'axios'
import store from '@/store'
import router from '@/router'
import { getTimeStamp } from '@/utils/auth'
import { Message } from 'element-ui'

// 创建axios的实例
const service = Axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})
const TimeOut = 7600 // 定义规定的超时时间

// 请求拦截器             这个config必须return
service.interceptors.request.use(config => {
  if (store.getters.token) {
    console.log('353535')
    // 判断token是否过期
    if (isTimeOut()) {
      store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(new Error('token 超时'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

/**
 *
 *
 * **/

// 响应拦截器
service.interceptors.response.use((response) => {
  const { success, data, message } = response.data
  if (success) {
    return data
  } else {
    // 提示消息
    Message.error(message)
    // 失败返回错误信息 没有错误对象所以new一个
    return Promise.reject(new Error(message))
  }
}, (error) => {
  if (error.response && error.response.data && error.response.data.code === 10002) {
    store.dispatch('user/logout')
    router.push('/login')
  } else {
  // 调用elementui消息组件弹出  提示信息
    Message.error(error.message)
  }
  //   返回错误信息，跳出执行成功，进入catch
  return Promise.reject(error)
})

function isTimeOut() {
  const timeNow = Date.now()
  const timeStm = getTimeStamp()
  return (timeNow - timeStm) / 1000 > TimeOut
}

// 导出service实例
export default service
