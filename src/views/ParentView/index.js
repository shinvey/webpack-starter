import loadable from 'react-loadable'
import Loading from '../components/Loading'

export const route = {
  key: 'parent',
  name: '父亲',
  path: '/parent',
  // auth: true
}

export const Content = loadable({
  loader: () => import(/* webpackChunkName: "Nav" */'./View'),
  loading: Loading
})
