export default {
  key: 'parent',
  name: '父亲',
  path: '/app/parent',
  content: () => import(/* webpackChunkName: "parent" */'./View'),
}
