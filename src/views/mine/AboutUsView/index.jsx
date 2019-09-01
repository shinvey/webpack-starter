import React from 'react'
import { Route } from 'react-router-dom'
import loadable from 'react-loadable'
import Loading from '@/views/Loading'

export const navigation = {
  path: '/mine/about-us',
  name: '关于我们'
}
export function Content () {
  const View = loadable({
    loader: () => import('./View'),
    loading: Loading,
    render (loaded, props) {
      const Component = loaded.default
      return <Component navigation={navigation} {...props}/>
    }
  })
  return <Route path={navigation.path} component={View}/>
}
