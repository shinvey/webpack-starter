import loadable from 'react-loadable'
import Loading from '../components/Loading'

export const route = {
  key: 'nav',
  name: '视图导航',
  path: '/app/nav/:welcome?',
  auth: true
}

export const Content = loadable({
  loader: () => import(/* webpackChunkName: "Nav" */'./View'),
  loading: Loading
})