import React from 'react'
import { Route, Link } from 'react-router-dom'
import loadable from '@loadable/component'
import Loading from '../Loading'

export function Navigation () {
  return <Link to="/">Home</Link>
}
export function Content () {
  const View = loadable(() => import('./View'), {
    fallback: <Loading />
  })
  return <Route path="/" exact component={View} />
}
