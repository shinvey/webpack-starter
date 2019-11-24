import React from 'react'
import {
  Route,
  useHistory,
  useLocation
} from 'react-router-dom'
import { trigger, on, off } from 'sunny-js/util/DOMEvent'
import { isLogin, LOGIN, LOGIN_SUCCESS } from './index'

function goBack ({ data: location }) {
  useHistory().replace(location)
}
// 相应登录成功事件
off(LOGIN_SUCCESS, goBack) // 清理
on(LOGIN_SUCCESS, goBack) // 重新绑定

// function listenLoginRequest () {
//   // todo 登录视图检测到登录事件后，执行登录业务
//   // 如果将登录事件绑定到请求上，可能会多次发送登录事件，加上是否已经在登录界面到判断
//   // 如果已经在登录界面，还接收到登录事件，则可以忽略
// }
// off(LOGIN, listenLoginRequest)
// on(LOGIN, listenLoginRequest)

/**
 * 定义一个需要用户登录才能使用的路由
 * 当前自定义的路由组件是业务公用组件
 * https://reacttraining.com/react-router/web/example/auth-workflow
 * @param Component
 * @param rest
 */
export default function AuthRoute ({ children, component, render, ...rest }) {
  // debugger
  // 如果未登录
  if (!isLogin()) {
    const currentLocation = useLocation()
    // 发送请求登录事件
    trigger(LOGIN, currentLocation)
    return <Route {...rest}><></></Route>
  }

  let Component
  if (children) {
    Component = <Route {...rest}>{children}</Route>
  } else if (component) {
    Component = <Route {...rest} component={component} />
  } else if (render) {
    Component = <Route {...rest} render={render} />
  }

  return Component
}
