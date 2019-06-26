import React from 'react'
import { Link } from 'react-router-dom'
import loadable from '@loadable/component'
import Loading from '../Loading'
import PrivateRoute from './Login/PrivateRoute'

export function Navigation () {
  return <Link to="/users/">Users</Link>
}
export function Content () {
  const App = loadable(() => import('./App'), {
    fallback: <Loading />
  })
  return <PrivateRoute path="/users/" component={App} />
}
