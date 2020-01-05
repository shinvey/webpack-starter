/**
 * 不同路由共享视图的用例
 */

export default {
  key: 'brotherSon',
  name: '兄弟的儿子',
  path: '/app/parent/brother/grandchild',
  content: import('../../Child/GrandchildView/View.jsx'),
}
