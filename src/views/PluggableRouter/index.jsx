import React from 'react'
import { Router, Route, Switch as RouterSwitch, Redirect } from 'react-router-dom'
import { compile } from 'path-to-regexp'
import history from './history'
import viewScanner, { modulePathToDirPath } from './viewScanner'
import AuthRoute from '../Auth/AuthRoute'
import { arrRoutesToFlatRoutes } from './flatRoutes'
import { arrRoutesToNestingRoutes } from './nestingRoutes'

/**
 * 集合了所有路由配置信息，以它们的key作为键名
 * 没有key的路由配置默认使用视图文件路径，如parent/childView/index.js会返回parent/child
 */
const routes = {}
export { routes }

// 收集路由角色信息
const roles = {}
/**
 * 保存或读取route role信息
 * @param {string} [role=normal] 如果不传则默认返回normal
 * @returns {string}
 */
function routeRole (role = 'normal') {
  roles[role] = undefined
  return role
}

// 分类存放路由集合
const RouteShelves = {}
/**
 * 定义路由配置集合类型
 * @typedef {object} RouteParcel
 * @property {object} route
 * @property {function} Content
 */
/**
 * 根据路由角色选择该角色分组下路由
 * @param {string} [role]
 * @returns {RouteParcel[] | ReactNode[]}
 */
export function selectRoutes (role = routeRole()) {
  return RouteShelves[role + 'Routes'] || []
}
/**
 * 存放路由集合
 * @param {ReactNode[] | RouteParcel[]} parcels
 * @param {string} [role]
 * @returns {ReactNode[] | RouteParcel[]} parcels
 */
function shelveRoutes (parcels, role = routeRole()) {
  if (role && parcels) {
    RouteShelves[role + 'Routes'] = parcels
  }
  return parcels || []
}
/**
 * 分拣路由
 * @param {RouteParcel} parcel
 * @param {string} role
 * @returns {RouteParcel[]}
 */
function sortRoute (parcel, role = routeRole()) {
  const target = RouteShelves[role + 'Routes'] = RouteShelves[role + 'Routes'] || []
  if (parcel.route && parcel.Content) {
    target.push(parcel)
  }
  return target
}
viewScanner({
  iteratee (ViewModule, modulePath) {
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
    // 收集路由角色信息，便于后续批量创建经过role分组的路由集合
    routeRole(route.role)

    // 如果想把每个视图接口文件的路径作为router path，可以考虑处理ViewModule.modulePath路径信息
    // return <Route path={routerPath(modulePath)} component={Content} />

    sortRoute({
      route,
      Content
    }, route.role)
  },
})

/**
 * 将路由配置信息集合转换成路由组件
 */
const transformOptions = {
  props: { routes },
  pickRoute (route) {
    return route.auth ? AuthRoute : Route
  }
}
// 根据路由角色进行遍历，并将路由配置信息转换成路由组件
Object.keys(roles).forEach(role => {
  /**
   * 默认用嵌套路由，其他使用扁平路由
   */
  const arrRoutesToReactRoutes = (role === routeRole() ? arrRoutesToNestingRoutes : arrRoutesToFlatRoutes)
  shelveRoutes(
    arrRoutesToReactRoutes(selectRoutes(role), transformOptions),
    role
  )
})

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
