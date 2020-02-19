import React from 'react'
import { Link } from 'react-router-dom'
import { hide, show } from '@/views/components/Loading'

export default function View ({ route, routes }) {
  return <div data-page={route.key}>
    <h2>Home</h2>
    <p>Hello world!</p>
    <p><Link to={routes.nav.toPath()}>视图导航</Link></p>
    <p><Link to={routes.login.toPath()}>用户登录</Link></p>
    <button onClick={show}>show loading</button>
    <button onClick={hide}>hide loading</button>
  </div>
}
