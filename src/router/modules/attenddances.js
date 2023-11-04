import Layout from '@/layout'
export default {
  path: '/attenddances',
  name: 'attenddances',
  component: Layout,
  children: [{
    path: '',
    component: () => import('@/views/attenddances'),
    meta: { title: '考勤', icon: 'excel' }
  }]

}
