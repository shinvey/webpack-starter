import loadable from 'react-loadable'
import Loading from '@/views/components/Loading'

export const route = {
  key: 'about-us',
  name: '关于我们',
  path: '/mine/about-us',
}
export const Content = loadable({
  loader: () => import(/* webpackChunkName: "AboutUsView" */'./View'),
  loading: Loading,
})
