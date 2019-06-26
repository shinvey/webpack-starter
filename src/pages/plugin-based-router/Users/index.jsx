import React from 'react'
import { Route, Link } from 'react-router-dom'
import loadable from '@loadable/component'
import Loading from '../Loading'

export function Navigation () {
  return <Link to="/users/">Users</Link>
}
export function Content () {
  const App = loadable(() => import('./App'), {
    fallback: <Loading />
  })
  return <Route path="/users/" component={App} />
}
