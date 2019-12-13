import loadable from 'react-loadable'
import Loading from '../../../components/Loading'

/**
 * 让Kid视图脱离Parent嵌套用例
 */

export const route = {
  key: 'kid',
  name: '小儿子',
  path: '/app/parent/kid',
  // 改写嵌套规则，当前视图的路由变为/app/parent的兄弟节点
  nest: '/app/parentKid',
}

export const Content = loadable({
  loader: () => import('./View'),
  loading: Loading
})
