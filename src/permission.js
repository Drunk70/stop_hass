import store from './store'
import router from './router'
const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/')
    } else {
      // 判断有没有获取用户数据，没有就获取
      if (!store.state.user.userInfo.userId) {
        await store.dispatch('user/getUserInfoS')
      }
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
    }
  }
})
router.afterEach(() => {

})
