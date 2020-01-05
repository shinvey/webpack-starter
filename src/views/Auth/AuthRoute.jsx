import React from 'react'
import { Route } from 'react-router'
import { isLogin } from './index'
import { requestLogin } from './channel'

/**
 * 定义一个需要用户登录才能使用的路由
 * 当前自定义的路由组件是业务公用组件
 * https://reacttraining.com/react-router/web/example/auth-workflow
 */
export default function AuthRoute ({ children, component, render, routes, ...rest }) {
  return (
    <Route
      {...rest}
      render={props => {
        // 如果未登录
        if (!isLogin()) {
          /**
           * react组件必须有个返回
           * sendAction应该要异步执行
           */
          // 发送请求登录事件
          setTimeout(() => requestLogin())
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
      }}
    />
  )
}
