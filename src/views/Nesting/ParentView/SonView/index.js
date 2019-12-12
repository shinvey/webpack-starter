import loadable from 'react-loadable'
import Loading from '../../../components/Loading'

export const route = {
  key: 'son',
  name: '儿子',
  path: '/app/parent/son',
  // auth: true
}

export const Content = loadable({
  loader: () => import(/* webpackChunkName: "son" */'./View'),
  loading: Loading
})
