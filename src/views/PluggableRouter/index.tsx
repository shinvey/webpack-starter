import React, { Attributes, ReactNode } from 'react'
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
  /**
   * 默认会使用path属性确定路由嵌套关系。该属性在不影响path原有功能的情况下，重定义路由嵌套关系。
   * Note:
   * - 运行时会始终为string类型
   * - 默认从path取值
   */
  nest?: string | string[]
  // 跟兄弟节点排序
  sort?: number,
  // route path中的动态参数由params替换
  toPath(params: object): string,
  getNest(): string
}

export interface PluggableRoutes {
  [RouteKey: string]: PluggableRoute
}

export interface PluggableRouteProps {
  // 当前路由配置
  route: PluggableRoute
  // 所有路由配置。通过route key访问
  routes: PluggableRoutes
}

export interface PluggableRouteComponentProps extends PluggableRouteProps {
  // 当前路由的子路由组件集合。通过route key访问
  childrenRoutes: {
    [RouteKey: string]: ReactNode
  }
}
