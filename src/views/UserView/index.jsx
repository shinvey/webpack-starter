import React from 'react'
import loadable from 'react-loadable'
import Loading from '../Loading'
import AuthRoute from './LoginView/AuthRoute'

export const navigation = {
  path: '/users',
  name: '用户信息'
}
export function Content () {
  const View = loadable({
    loader: () => import('./View'),
    loading: Loading
  })
  return <AuthRoute path={navigation.path} component={View} />
}
