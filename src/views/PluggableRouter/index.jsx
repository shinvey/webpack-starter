import React from 'react'
import { Router, Route, Switch as RouterSwitch, Redirect } from 'react-router-dom'
import { compile } from 'path-to-regexp'
import history from './history'
import viewScanner, { modulePathToDirPath } from './viewScanner'
// import viewScanner, { routerPath } from '@/views/viewScanner'
import AuthRoute from '../Auth/AuthRoute'
import { flatRoutes } from './flatRoutes'
import { arrRoutesToNestingRoutes } from './nestingRoutes'

/**
 * 载入当前page下所有视图索引，创建routes and normalRoutes
 * 这里完全可决定是否要把所有路由信息以怎样的数据结构传给所有视图
 */
// const routes = []
/**
 * 如果想以对象形式创建路由表
 * 可以考虑在视图接口的route上添加key属性作为对象的key
 */
const routes = {}
/**
 * 根结点Route组件列表
 * @type {Array}
 * @deprecated
 */
let rootRoutes = []
// 默认Route组件列表
let normalRoutes = []
viewScanner({
  iteratee (ViewModule, modulePath, index) {
    const {
      // 视图接口暴露的Content
      Content,
      // 视图接口暴露的route配置
      route,
    } = ViewModule
    const dir = modulePathToDirPath(modulePath)

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

    /**
     * 存放ViewModule路径（不包含View后缀），也是生成嵌套路由重要依赖属性
     * 默认以route.path来分析嵌套关系。
     * 如果你喜欢以路径来体现UI视觉上的嵌套关系，可以取消注释以下代码
     */
    // route.nest = route.nest || dir
    // console.debug(route.nest)

    // 收集路由配置信息，如果没有设置key，则使用目录路径作为key
    route.key = route.key || dir
    routes[route.key] = route

    // 如果想把每个视图接口文件的路径作为router path，可以考虑处理ViewModule.modulePath路径信息
    // return <Route path={routerPath(modulePath)} component={Content} />

    ;(route.role === 'root' ? rootRoutes : normalRoutes).push({
      route,
      Content
    })
  },
})

const flatRoutesOptions = {
  props: { routes },
  pickRoute (route) {
    return route.auth ? AuthRoute : Route
  }
}
// 扁平化方式组织路由
// normalRoutes = flatRoutes(normalRoutes, flatRoutesOptions)
// 嵌套方式组织路由
normalRoutes = arrRoutesToNestingRoutes(normalRoutes, flatRoutesOptions)
export {
  routes,
  normalRoutes,
}

/**
 * Note:
 * 筛选根结点的路由是因老应用有嵌套路由组合的需要。如果是全新开发，不需要以下两行代码
 */
rootRoutes = flatRoutes(rootRoutes, flatRoutesOptions)
export { rootRoutes }

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
