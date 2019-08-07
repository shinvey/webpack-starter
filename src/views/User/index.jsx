import React from 'react'
import loadable from '@loadable/component'
import Loading from '../Loading'
import AuthRoute from './Login/AuthRoute'

export const navigation = {
  path: '/users',
  name: '用户信息'
}
export function Content () {
  const View = loadable(() => import('./View'), {
    fallback: <Loading />
  })
  return <AuthRoute path={navigation.path} component={View} />
}
