import Vue from 'vue'
import Router from 'vue-router'
import employees from '@/router/modules/employees'
import approvals from '@/router/modules/approvals'
import attenddances from '@/router/modules/attenddances'
import departments from '@/router/modules/departments'
import permission from '@/router/modules/permission'
import salarys from '@/router/modules/salarys'
import setting from '@/router/modules/setting'
import social from '@/router/modules/social'
// import userRouter from './modules/user'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '主页', icon: 'dashboard' }
    }]
  },
  {
    path: '/import',
    component: Layout,
    hidden: true,
    children: [{
      path: '',
      name: 'import',
      component: () => import('@/views/import')
    }]
  }
  // userRouter // 放置一个都可以访问的路由
]

// 动态路由
export const asyncRoutes = [
  approvals,
  attenddances,
  departments,
  employees,
  permission,
  salarys,
  setting,
  social
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: [...constantRoutes]
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
