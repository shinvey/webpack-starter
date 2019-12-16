import loadable from 'react-loadable'
import Loading from '../../../../components/Loading'

export const route = {
  key: 'sonHome',
  name: '儿子首页',
  // 重用了SonView的path
  path: '/app/parent/son',
  // 改写嵌套规则，使其可以继承/parent/son
  nest: '/app/parent/son/index',
  // 因为重用了SonView的path，这里需要精确匹配
  exact: true
}

export const Content = loadable({
  loader: () => import('./View'),
  loading: Loading
})
