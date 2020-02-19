export default {
  key: 'SwitchTheme',
  name: '主题切换',
  path: '/SwitchTheme',
  content: () => import(/* webpackChunkName: "SwitchTheme" */'./View'),
}
