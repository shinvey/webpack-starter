export default {
  key: 'AdminLayout',
  name: '后台管理界面基础布局',
  path: '/admin',
  content: () => import(/* webpackChunkName: "AdminLayout" */'./View')
}
