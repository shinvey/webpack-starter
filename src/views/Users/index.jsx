import React from 'react'
import { Link } from 'react-router-dom'
import loadable from '@loadable/component'
import Loading from '../Loading'
import AuthRoute from './Login/AuthRoute'

export function Navigation () {
  return <Link to="/users/">Users</Link>
}
export function Content () {
  const View = loadable(() => import('./View'), {
    fallback: <Loading />
  })
  return <AuthRoute path="/users/" component={View} />
}
