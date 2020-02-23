export default {
  key: 'welcome',
  name: '欢迎',
  path: '/admin/welcome',
  content: () => import(/* webpackChunkName: "welcome" */'./View')
}
