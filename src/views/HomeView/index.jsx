import React from 'react'
import { Route } from 'react-router-dom'
import loadable from '@loadable/component'
import Loading from '../Loading'

export const navigation = {
  path: '/',
  name: 'Home',
  icon: 'home'
}
export function Content () {
  const View = loadable(() => import('./View'), {
    fallback: <Loading />
  })
  /**
   * path也可根据需要自定义
   * 大部分情况下可以直接使用navigation.path
   */
  return <Route path={navigation.path} exact component={View} />
}
