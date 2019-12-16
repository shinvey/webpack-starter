import loadable from 'react-loadable'
import Loading from '../../../../components/Loading'

export const route = {
  key: 'grandchild',
  name: '断层嵌套的grandchild',
  path: '/app/parent/child/grandchild',
  // auth: true
}

export const Content = loadable({
  loader: () => import(/* webpackChunkName: "grandchild" */'./View'),
  loading: Loading
})
