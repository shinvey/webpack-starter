import React from 'react'
import { Router, Route } from 'react-router-dom'
import { compile } from 'path-to-regexp'
import history from './history'
import viewScanner, { modulePathToDirPath } from './viewScanner'
// import viewScanner, { routerPath } from '@/views/viewScanner'
import AuthRoute from '../Auth/AuthRoute'
import { flatRoutes } from './flatRoutes'
import { arrRoutesToNestingRoutes } from './nestingRoutes'

/**
 * 载入当前page下所有视图索引，创建routes and contents
 * 这里完全可决定是否要把所有路由信息以怎样的数据结构传给所有视图
 */
// const routes = []
/**
 * 如果想以对象形式创建路由表
 * 可以考虑在视图接口的navigation上添加id属性作为对象的key
 */
const routes = {}
// 根结点Route组件列表
let rootContents = []
let customContents = []
// 默认Route组件列表
let contents = []
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
    routes[route.key || dir] = route

    // 如果想把每个视图接口文件的路径作为router path，可以考虑处理ViewModule.modulePath路径信息
    // return <Route path={routerPath(modulePath)} component={Content} />

    const routeElement = {
      route,
      Content
    }
    switch (route.role) {
      case 'custom':
        // 自定义路由内容渲染方式，用于处理更复杂灵活多变的需求
        customContents.push(routeElement)
        break
      case 'root':
        // rootContents意图是放在嵌套路由的根结点位置
        rootContents.push(routeElement)
        break
      default:
        contents.push(routeElement)
        break
    }
  },
})
const flatRoutesOptions = {
  props: { routes },
  pickRoute (route) {
    return route.auth ? AuthRoute : Route
  }
}
rootContents = flatRoutes(rootContents, flatRoutesOptions)
customContents = flatRoutes(customContents, flatRoutesOptions)
// contents = flatRoutes(contents, flatRoutesOptions)
contents = arrRoutesToNestingRoutes(contents, flatRoutesOptions)
export {
  routes,
  rootContents,
  customContents,
  contents,
}

/**
 * 可拔插路由
 */
export default function PluggableRouter ({ children }) {
  return <Router history={history}>{children}</Router>
}
