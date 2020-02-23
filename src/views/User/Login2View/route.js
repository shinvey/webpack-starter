export default {
  key: 'login2',
  name: '用户登录2',
  path: '/user/login2',
  auth: false,
  content: () => import(/* webpackChunkName: "UserLogin2" */'./View'),
}
