import loadable from 'react-loadable'
import Loading from '../../../components/Loading'

/**
 * 不会将以下两个视为有嵌套关系的视图
 * EGameView path /egame
 * EGameListView path /egame/:id
 */

export const route = {
  key: 'EGameListView',
  name: 'EGameListView',
  path: '/app/egame/:id',
  exact: true
}

export const Content = loadable({
  loader: () => import('./View'),
  loading: Loading
})
