import React from 'react'
import { Route } from 'react-router-dom'
import loadable from 'react-loadable'
import Loading from '../Loading'

export const navigation = {
  path: '/about',
  name: '关于'
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
