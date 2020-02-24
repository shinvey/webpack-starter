export default {
  key: 'login',
  name: '用户登录',
  path: '/user/login',
  auth: false,
  content: () => import(/* webpackChunkName: "UserLogin" */'./View'),
}
