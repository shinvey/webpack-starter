import loadable from 'react-loadable'
import Loading from '../../components/Loading'

/**
 * 让Kid视图脱离Parent嵌套用例
 */

export const route = {
  key: 'kid',
  name: '小儿子',
  path: '/parent/kid',
  // 改写嵌套规则
  dir: 'parentKid',
  // 将Kid视图优先级提高，path解析优先于Parent视图
  sort: 1,
}

export const Content = loadable({
  loader: () => import('./View'),
  loading: Loading
})
