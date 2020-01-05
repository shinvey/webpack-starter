/**
 * 不会将以下两个视为有嵌套关系的视图
 * EGameView path /egame
 * EGameListView path /egame/:id
 */

export default {
  key: 'EGameListView',
  name: 'EGameListView',
  path: '/app/pcGame/:id',
  exact: true,
  content: import(/* webpackChunkName: "NestingEGameListView" */'./View')
}
