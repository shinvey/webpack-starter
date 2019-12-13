import loadable from 'react-loadable'
import Loading from '../../components/Loading'

export const route = {
  key: 'parent',
  name: '父亲',
  path: '/app/parent',
}

export const Content = loadable({
  loader: () => import(/* webpackChunkName: "parent" */'./View'),
  loading: Loading
})
