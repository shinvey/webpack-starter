export default {
  key: 'processEdit',
  name: '编辑申请单',
  path: '/admin/process/edit/:id',
  content: () => import(/* webpackChunkName: "processList" */'./View')
}
