import React from 'react'
import { Route, Link, withRouter } from 'react-router-dom'
import loadable from '@loadable/component'
import Loading from '../../Loading'

export const Navigation = withRouter(({ location }) => <Link to={{
  pathname: path,
  state: {
    // 当前的location位置，在登录成功后会返回
    from: location
  }
}}>Login</Link>)
export function Content () {
  const View = loadable(() => import('./View'), {
    fallback: <Loading />
  })
  return <Route path={path} component={View} />
}
export const path = '/login/'
