import React, { Attributes } from 'react'
import { Redirect, Router, Switch as RouterSwitch, RouteProps } from 'react-router'
import history from './history'
export * from './transform'

/**
 * 可拔插路由
 */
export default function PluggableRouter ({ children }) {
  return <Router history={history}>{children}</Router>
}

/**
 * 可拔插路由模块的Switch组件
 * 对原版Switch进行封装，加上No Match默认行为，用来满足嵌套路由全局默认No Match使用场景
 */
export function Switch ({ children, noMatch = '/404', ...props }) {
  return <RouterSwitch {...props}>
    {children}
    <Redirect to={noMatch} />
  </RouterSwitch>
}

export interface PluggableRoute extends Attributes, RouteProps {
  name?: string
}

export interface PluggableRoutes {
  [key: string]: PluggableRoute
}

export interface PluggableRouteProps {
  route: PluggableRoute,
  routes: PluggableRoutes
}
