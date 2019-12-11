import loadable from 'react-loadable'
import Loading from '../../components/Loading'

export const route = {
  key: 'brother',
  name: '兄弟',
  path: '/parent/brother',
}

export const Content = loadable({
  loader: () => import(/* webpackChunkName: "brother" */'./View'),
  loading: Loading
})
