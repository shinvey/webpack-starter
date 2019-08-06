import React from 'react'
import { Route, Link } from 'react-router-dom'
import loadable from '@loadable/component'
import Loading from '../Loading'

export function Navigation () {
  return <Link to={path}>Timer</Link>
}
export function Content () {
  const View = loadable(() => import(/* webpackChunkName: "Timer.View" */'./View'), {
    fallback: <Loading />
  })
  return <Route path={path} component={View}/>
}
export const path = '/timer/'
