import loadable from 'react-loadable'
import Loading from '../../../components/Loading'

/**
 * 不会将以下两个视为有嵌套关系的视图
 * EGameView path /egame
 * EGameListView path /egame/:id
 *
 * 并且按照require.context目录扫描规则追随系统对目录的排序规则
 * 如当前项目，使用require.context遍历目录时，会按深度优先，字母顺序，大些字母优先的排序规则，
 * EGameListView视图创建的路由优先级会比EGameView高一级
 */

export const route = {
  key: 'EGameListView',
  name: 'EGameListView',
  path: '/egame/:id',
}

export const Content = loadable({
  loader: () => import('./View'),
  loading: Loading
})
