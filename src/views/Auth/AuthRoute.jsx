import React, { useEffect } from 'react'
import { Route } from 'react-router-dom'
import { isLogin } from './index'
import {
  createLoginAction,
  onLoginSuccess, sendAction
} from './channel'
import history from '../Container/history'

/**
 * 定义一个需要用户登录才能使用的路由
 * 当前自定义的路由组件是业务公用组件
 * https://reacttraining.com/react-router/web/example/auth-workflow
 */
export default function AuthRoute ({ children, component, render, ...rest }) {
  useEffect(() => {
    // 监听登录成功通知
    const subscription = onLoginSuccess(from => {
      console.debug('login success, now go back to', from)
      // history.replace(from)
      history.goBack()
    })
    return function cleanup () {
      subscription.unsubscribe()
    }
  }, [])
  return <Route {...rest} render={props => {
    // 如果未登录
    if (!isLogin()) {
      // 发送请求登录事件
      setTimeout(() => {
        sendAction(createLoginAction(props.location))
      })
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
