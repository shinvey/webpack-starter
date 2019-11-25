import loadable from 'react-loadable'
import Loading from '../../components/Loading'

export const route = {
  key: 'login',
  name: '用户登录',
  path: '/user/login',
  // custom: true,
}

export const Content = loadable({
  loader: () => import(/* webpackChunkName: "UserLogin" */'./View'),
  loading: Loading
})
