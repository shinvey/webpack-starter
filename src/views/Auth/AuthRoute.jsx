import React from 'react'
import { Route } from 'react-router-dom'
import { isLogin } from './index'
import {
  createLoginAction,
  onRequestLogin,
  onLoginSuccess,
  sendAction
} from './channel'
import history from '../Container/history'

// 登录视图检测到登录事件后，执行登录视图跳转
onRequestLogin(({ to, from = { pathname: '/' } }) => {
  if (!to) {
    return console.warn('You are asked to specify a route as the key should be login, e.g. ',
      { key: 'login', path: 'user/login' })
  }
  // 如果将登录事件绑定到请求上，可能会多次发送登录事件，加上是否已经在登录界面到判断
  // 如果已经在登录界面，还接收到登录事件，则可以忽略
  if (to.path !== history.location.pathname) {
    console.debug('request login, so forward to ', to.path, ' from ', from)
    history.push(to.path, { from })
  }
})
// 监听登录成功通知
onLoginSuccess(({ from }) => {
  console.debug('login success, now go back to', from)
  // history.replace(from)
  history.goBack()
})

/**
 * 定义一个需要用户登录才能使用的路由
 * 当前自定义的路由组件是业务公用组件
 * https://reacttraining.com/react-router/web/example/auth-workflow
 */
export default function AuthRoute ({ children, component, render, routes, ...rest }) {
  return <Route {...rest} render={props => {
    // 如果未登录
    if (!isLogin()) {
      // 发送请求登录事件
      setTimeout(() => sendAction(createLoginAction({ to: routes.login, from: props.location })))
      return null
    }

    let _component
    /**
     * children, component, render按照React Router文档描述按优先级排列
     * https://reacttraining.com/react-router/web/api/Route/route-props
     */
    if (children) {
      // children已经被转义，可直接作为返回值
      _component = children
    } else if (component) {
      // component没有被转义，需要以jsx(React.createElement)作为返回值
      _component = <component {...props} />
    } else if (render) {
      // render是函数，需要调用后作为返回值
      _component = render(props)
    }
    return _component
  }} />
}
