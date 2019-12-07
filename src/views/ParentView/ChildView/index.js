import loadable from 'react-loadable'
import Loading from '../../components/Loading'

export const route = {
  key: 'child',
  name: '儿子',
  path: '/app/parent/child',
  // auth: true
}

export const Content = loadable({
  loader: () => import(/* webpackChunkName: "Nav" */'./View'),
  loading: Loading
})
