import React, { createElement, FC, useState } from 'react'
import { Route, RouteProps } from 'react-router'
import { isLogin } from './index'
import { requestLogin, blockVisitor } from './channel'
import { fetchPermissions } from './ACL/service'
import { ACLRouteProps, isAllowed, initACL } from './ACL/AccessControl'
import { PluggableRoute, PluggableRouteProps } from '../PluggableRouter'

interface AuthRouteProps extends PluggableRouteProps, RouteProps {
  route: ACLRouteProps & PluggableRoute
}
/**
 * 定义一个需要用户登录才能使用的路由
 * 当前自定义的路由组件是业务公用组件
 * https://reacttraining.com/react-router/web/example/auth-workflow
 */
const AuthRoute: FC<AuthRouteProps> = (
  {
    children, component, render,
    routes, route,
    ...rest
  }
) => {
  const [RouteComponent, updateComponent] = useState(null)
  // 兼容Route组件接口，拿到最终组件实例
  const getComponent = (props) => {
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
      _component = createElement(component, props) // <component {...props} />
    } else if (render) {
      // render是函数，需要调用后作为返回值
      _component = render(props)
    }

    return _component
  }
  const renderFn = props => {
    if (RouteComponent) {
      return RouteComponent
    }

    if (!isLogin()) { // 如果未登录
      /**
       * 发送请求登录事件
       * sendAction应该要异步执行
       */
      setTimeout(() => requestLogin())
      // react组件必须有个返回
      return null
    }

    // 如果已经完成登录，则进行权限验证
    fetchPermissions().then(permissions => {
      initACL(permissions)
      isAllowed(route) ? updateComponent(getComponent(props)) : blockVisitor()
    })

    return null
  }

  return <Route {...rest} render={renderFn} />
}

export default AuthRoute
