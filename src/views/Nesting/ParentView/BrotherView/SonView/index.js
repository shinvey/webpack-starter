import loadable from 'react-loadable'
import Loading from '../../../../components/Loading'

/**
 * 不同路由共享视图的用例
 */

export const route = {
  key: 'brotherSon',
  name: '兄弟的儿子',
  path: '/app/parent/brother/grandchild',
}

export const Content = loadable({
  loader: () => import('../../Child/GrandchildView/View.jsx'),
  loading: Loading
})
