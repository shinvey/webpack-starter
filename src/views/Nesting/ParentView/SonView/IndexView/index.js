import loadable from 'react-loadable'
import Loading from '../../../../components/Loading'

export const route = {
  key: 'sonHome',
  name: '儿子首页',
  // 重用了SonView的path
  path: [
    '/app/parent/son',
    '/app/parent/son/index', // 创建别名
    '/app/parent/brother/kid', // 可以作为/app/parent/brother的子视图
  ],
  // 改写嵌套规则，使其可以继承/parent/son。
  // 如果path为数组，仅影响第一个path。
  // nest也可以声明为数组与path一一对应
  nest: '/app/parent/son/index',
  // 因为重用了SonView的path，这里需要精确匹配
  exact: true
}

export const Content = loadable({
  loader: () => import('./View'),
  loading: Loading
})
