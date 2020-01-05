/**
 * 让Kid视图脱离Parent嵌套用例
 */

export default {
  key: 'kid',
  name: '与父亲成为兄弟kid视图',
  path: '/app/parent/kid',
  // 改写嵌套规则，当前视图的路由变为/app/parent的兄弟节点
  nest: '/app/parentKid',
  content: import('./View'),
}
