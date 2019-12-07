import React from 'react'
import { Router, Route } from 'react-router-dom'
import { compile } from 'path-to-regexp'
import history from './history'
import viewScanner from './viewScanner'
// import viewScanner, { routerPath } from '@/views/viewScanner'
import AuthRoute from '../Auth/AuthRoute'

/**
 * 载入当前page下所有视图索引，创建routes and contents
 * 这里完全可决定是否要把所有路由信息以怎样的数据结构传给所有视图
 */
// const routes = []
/**
 * 如果想以对象形式创建路由表
 * 可以考虑在视图接口的navigation上添加id属性作为对象的key
 */
export const routes = {}
export const customContents = []
// 根结点Route组件列表
export const rootContents = []
// 默认Route组件列表
export const contents = viewScanner({
  iteratee (ViewModule, modulePath, index) {
    const {
      // 视图接口暴露的Content
      Content,
      // 视图接口暴露的route配置
      route,
    } = ViewModule

    /**
     * 用于翻译路由动态path路径
     * {@link https://github.com/pillarjs/path-to-regexp#compile-reverse-path-to-regexp path-to-regexp}
     * react router 官方文档注明Route组件的path参数使用了path-to-regexp这个库
     * {@link https://reacttraining.com/react-router/web/api/Route/path-string-string Route path}
     * @example
     * routes.nav.path
     * // => /app/nav/:welcome?
     * routes.nav.toPath({ welcome: 'hello' })
     * // => /app/nav/hello
     */
    route.toPath = compile(route.path, { encode: encodeURIComponent })

    // routes.push(route)
    routes[route.key || index] = route

    // 如果想把每个视图接口文件的路径作为router path，可以考虑处理ViewModule.modulePath路径信息
    // return <Route path={routerPath(modulePath)} component={Content} />

    // 自定义路由内容渲染方式，用于处理更复杂灵活多变的需求
    if (route.role === 'custom') {
      customContents.push(<Content key={index} {...route} routes={routes} />)
      return
    }

    // 批量创建Route
    const MyRoute = route.auth ? AuthRoute : Route
    /**
     * 用Route组件给View视图传值
     * 为什么不用component https://reacttraining.com/react-router/web/api/Route/component
     * because you will get undesired component unmounts/remounts.
     *
     * 关于嵌套路由的生成请移至readme.md文档 [如何生成嵌套路由？](./readme.md#nested-routes)
     */
    const RouteComponent = (
      <MyRoute
        key={index}
        {...route}
        routes={routes}
        render={props => <Content {...props} route={route} routes={routes} />}
      />
    )

    /**
     * rootContents意图是放在嵌套路由的根结点位置
     */
    if (route.role === 'root') {
      rootContents.push(RouteComponent)
      return
    }

    return RouteComponent
  },
})

/**
 * 可拔插路由
 */
export default function PluggableRouter ({ children }) {
  return <Router history={history}>{children}</Router>
}
