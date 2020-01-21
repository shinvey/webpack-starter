export default {
  key: 'grandchild',
  name: '断层嵌套的grandchild',
  path: '/app/parent/child/grandchild',
  // auth: true
  content: () => import(/* webpackChunkName: "grandchild" */'./View'),
}
