export default {
  key: 'processList',
  name: '申请单列表',
  path: '/admin/process',
  nest: '/admin/process/list',
  exact: true,
  content: () => import(/* webpackChunkName: "processList" */'./View')
}
