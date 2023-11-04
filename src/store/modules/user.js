import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetail } from '@/api/user'
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions

}
