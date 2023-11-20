import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetail } from '@/api/user'
import { resetRouter } from '@/router'
const state = {
  token: getToken(),
  userInfo: {}
}
const mutations = {
  saveToken(state, token) {
    // 数据设置给state的token
    state.token = token
    // 同步给缓存
    setToken(token)
  },
  // 删除token的方法
  remToken(state) {
    state.token = null
    // 缓存的token置空
    removeToken()
  },
  // 设置userinfo的方法
  setUserInfo(state, res) {
    state.userInfo = res
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
const actions = {
  // 调取登录接口并存储
  async loginS(context, data) {
    const res = await login(data)
    context.commit('saveToken', res)
    setTimeStamp()
  },
  // 获取用户列表
  async getUserInfoS(context) {
    const res = await getUserInfo()
    const baseInfo = await getUserDetail(res.userId)
    context.commit('setUserInfo', { ...res, ...baseInfo })
    return res
  },
  // 登出
  logout(context) {
    context.commit('remToken')
    context.commit('removeUserInfo')
    resetRouter() // 重置路由
    // 去设置权限模块下路由为初始状态
    // Vuex子模块怎么调用子模块的action 都没加锁的情况下 可以随意调用
    // 不加命名空间的情况下的 所有的mutations和action都是挂在全局上的 所以可以直接调用
    // 但是加了命名空间的子模块 怎么调用另一个加了命名空间的子模块的mutations
    // 加了命名空间的context指的不是全局的context
    // mutations名称 载荷 payload 第三个参数  { root: true } 调用根级的mutations或者action
    context.commit('permission/setRoutes', [], { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions

}
