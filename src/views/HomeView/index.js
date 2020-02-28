import loadable from 'react-loadable'
import Loading from '../components/Loading'

export const route = {
  key: 'home',
  name: 'Home',
  path: '/',
  exact: true,
  resource: 'home',
  icon: 'home'
}

export const Content = loadable({
  loader: () => import(/* webpackChunkName: "Home" */'./View'),
  loading: Loading
})
