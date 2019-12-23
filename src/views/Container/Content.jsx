import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { routes, useCustomRoute, selectRoutes } from '../PluggableRouter'
import ErrorBoundary from '../components/ErrorBoundary'
import AuthRoute from '../Auth/AuthRoute'

/**
 * 为PluggableRouter模块，使用自定义路由组件
 * 自定义选择路由组件的逻辑，可以为路由增加特别功能
 * 这里我们为路由配置增加了一个auth认证功能
 */
useCustomRoute(route => {
  return route.auth ? AuthRoute : Route
})

/**
 * Container内容部分
 * @param {object} props
 * @param {*} [props.children]
 */
export default function Content ({ children }) {
  return (
    <ErrorBoundary routes={routes}>
      <Switch>
        {selectRoutes()}
        {children}
      </Switch>
    </ErrorBoundary>
  )
}
