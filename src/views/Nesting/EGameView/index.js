import loadable from 'react-loadable'
import Loading from '../../components/Loading'

export const route = {
  key: 'EGameView',
  name: 'EGameView',
  path: '/app/pcGame',
}

export const Content = loadable({
  loader: () => import('./View'),
  loading: Loading
})
