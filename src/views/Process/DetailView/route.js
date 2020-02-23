export default {
  key: 'processDetail',
  name: '申请单详情',
  path: '/admin/process/detail/:id',
  content: () => import(/* webpackChunkName: "processList" */'./View')
}
