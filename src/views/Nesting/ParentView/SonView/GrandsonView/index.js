import loadable from 'react-loadable'
import Loading from '../../../../components/Loading'

export const route = {
  key: 'grandson',
  name: 'grandson',
  path: '/app/parent/son/grandson',
  // auth: true
}

export const Content = loadable({
  loader: () => import(/* webpackChunkName: "grandson" */'./View'),
  loading: Loading
})
