import React from 'react'
import { Navigation } from '../components/Navgation'
import { hide, show } from '../components/Loading'

export default function View (props) {
  const { routes } = props
  return (
    <>
      <Navigation {...props} />
      <button onClick={show}>show loading</button>
      <button onClick={hide}>hide loading</button>
      <p>
        路由动态路径，通过传入参数解析成普通路径的调用例子
        {routes.nav.path}, {routes.nav.toPath()}, {routes.nav.toPath({ welcome: 'hello' })}
      </p>
    </>
  )
}
