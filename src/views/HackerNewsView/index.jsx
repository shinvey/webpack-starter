import React from 'react'
import { Route } from 'react-router-dom'
import loadable from 'react-loadable'
import Loading from '../components/Loading'

export const navigation = {
  path: '/hacker-news',
  name: '骇客新闻'
}

const View = loadable({
  loader: () => import(/* webpackChunkName: "HackerNews" */'./View'),
  loading: Loading,
  // render (loaded, props) {
  //   const Component = loaded.default
  //   return <Component navigation={navigation} {...props}/>
  // }
})
export function Content () {
  return <Route path={navigation.path} component={View}/>
}
