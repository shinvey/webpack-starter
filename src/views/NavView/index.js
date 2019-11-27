import loadable from 'react-loadable'
import Loading from '../components/Loading'

export const route = {
  key: 'nav',
  name: '视图导航',
  path: '/nav',
  auth: true
}

export const Content = loadable({
  loader: () => import(/* webpackChunkName: "Nav" */'./View'),
  loading: Loading
})

export function codeSplit (loader) {
  return loadable({
    loader: () => import(/* webpackChunkName: "Nav" */'./View'),
    loading: Loading
  })
}

// todo 对code split部分代码再封装一层
