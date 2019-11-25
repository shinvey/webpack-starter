import loadable from 'react-loadable'
import Loading from '../components/Loading'

export const route = {
  key: 'hacker-news',
  name: '骇客新闻',
  path: '/hacker-news',
}

/**
 * 放在Content外部
 * actions执行一次，
 * reducer无法正常热更新。第二次修改要第三次刷新才能看到
 *
 * 放在Content里面
 * actions执行两次
 * reducer正常热更新
 */
export const Content = loadable({
  loader: () => import(/* webpackChunkName: "HackerNews" */'./View'),
  loading: Loading,
})
