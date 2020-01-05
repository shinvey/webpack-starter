export default {
  key: 'grandson',
  name: '孙子',
  path: '/app/parent/son/grandson',
  // auth: true
  content: import(/* webpackChunkName: "grandson" */'./View'),
}
