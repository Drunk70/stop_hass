import Layout from '@/layout'
export default {
  path: '/social',
  name: 'approvsocialals',
  component: Layout,
  children: [{
    path: '',
    component: () => import('@/views/social'),
    meta: { title: '社保', icon: 'table' }
  }]

}
