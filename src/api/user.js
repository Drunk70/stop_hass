// 引入until里的二次封装的axios
import request from '@/utils/request'

// 每个方法都是返回的一个promise对象（axios返回的是promise对象）
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}
/** **
 *
 *根据用户id获取详情
 *
 * ***/
export function getUserDetail(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'get'
  })
}

export function logout() {
  return request({

  })
}

