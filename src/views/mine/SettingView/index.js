import loadable from 'react-loadable'
import Loading from '@/views/components/Loading'

export const route = {
  key: 'setting',
  name: '个人设置',
  path: '/mine/setting',
}
export const Content = loadable({
  loader: () => import(/* webpackChunkName: "SettingView" */'./View'),
  loading: Loading,
})
