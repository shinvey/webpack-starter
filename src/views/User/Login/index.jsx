import React from 'react'
import { Route } from 'react-router-dom'
import loadable from '@loadable/component'
import Loading from '../../Loading'

export const navigation = {
  path: '/login',
  name: '登录',
  hideInMenu: true
}
export function Content () {
  const View = loadable(() => import('./View'), {
    fallback: <Loading />
  })
  return <Route path={navigation.path} component={View} />
}
