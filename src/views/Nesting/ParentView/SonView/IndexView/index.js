import loadable from 'react-loadable'
import Loading from '../../../../components/Loading'

export const route = {
  key: 'sonHome',
  name: '儿子首页',
  path: '/app/parent/son',
  // 使用exact属性会默认提高路由解析优先级
  exact: true
}

export const Content = loadable({
  loader: () => import('./View'),
  loading: Loading
})
