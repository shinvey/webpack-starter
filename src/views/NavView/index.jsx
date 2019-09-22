import React from 'react'
import { Route } from 'react-router-dom'
import loadable from 'react-loadable'
import Loading from '../components/Loading'

export const navigation = {
  path: '/nav',
  name: '视图导航',
}

const View = loadable({
  loader: () => import(/* webpackChunkName: "Nav" */'./View'),
  loading: Loading
})

export function Content (props) {
  /**
   * path也可根据需要自定义
   * 大部分情况下可以直接使用navigation.path
   *
   * 用Route组件给View视图传值
   * 为什么不用component https://reacttraining.com/react-router/web/guides/basic-components/route-rendering-props
   * because you will get undesired component unmounts/remounts.
   */
  return <Route path={navigation.path} exact render={routeProps => <View {...routeProps} {...props} />} />
}
