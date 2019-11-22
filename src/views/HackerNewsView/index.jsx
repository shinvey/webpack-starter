import React from 'react'
import { Route } from 'react-router-dom'
import loadable from 'react-loadable'
import Loading from '../components/Loading'

export const navigation = {
  path: '/hacker-news',
  name: '骇客新闻'
}

/**
 * 放在Content外部
 * actions执行一次，
 * reducer无法正常热更新。第二次修改要第三次刷新才能看到
 *
 * 放在Content里面
 * actions执行两次
 * reducer正常热更新
 */
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
