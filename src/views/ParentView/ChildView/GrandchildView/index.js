import loadable from 'react-loadable'
import Loading from '../../../components/Loading'

export const route = {
  key: 'grandchild',
  name: '孙子',
  path: '/app/parent/child/grandchild',
  // auth: true
}

export const Content = loadable({
  loader: () => import(/* webpackChunkName: "Nav" */'./View'),
  loading: Loading
})
