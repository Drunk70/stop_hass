import Layout from '@/layout'
export default {
  path: '/employees',
  name: 'employees',
  component: Layout,
  children: [{
    path: '',
    name: 'employees',
    component: () => import('@/views/employees'),
    meta: { title: '员工', icon: 'people' }
  }, {
    path: 'detail/:id', //  ?的含义是表示该参数可传可不传  动态路由参数  /employees/detail/123  /employees/detail
    component: () => import('@/views/employees/detail'),
    hidden: true, // 表示该内容不在左侧菜单显示
    meta: {
      title: '员工详情'
    }
  }, {
    path: 'print/:id',
    component: () => import('@/views/employees/print'),
    hidden: true,
    meta: {
      title: '员工打印'
    }
  }
  ]
}
