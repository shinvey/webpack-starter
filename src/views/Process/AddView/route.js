export default {
  key: 'processAdd',
  name: '添加申请单',
  path: '/admin/process/add',
  content: () => import(/* webpackChunkName: "processList" */'./View')
}
