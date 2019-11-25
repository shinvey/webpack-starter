import loadable from 'react-loadable'
import Loading from '../components/Loading'

export const route = {
  key: 'about',
  name: '关于',
  path: '/about',
}

export const Content = loadable({
  loader: () => import(/* webpackChunkName: "About" */'./View'),
  loading: Loading,
})
