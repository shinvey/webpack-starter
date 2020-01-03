import { compile } from 'path-to-regexp'
import viewScanner, { modulePathToDirPath } from './viewScanner'
import { arrRoutesToFlatRoutes } from './flatRoutes'
import { arrRoutesToNestingRoutes } from './nestingRoutes'

/**
 * 集合了所有路由配置信息，以它们的key作为键名
 * 没有key的路由配置默认使用视图文件路径，如parent/childView/index.js会返回parent/child
 */
const routes = {}
/**
 * 访问所有路由配置信息表
 * @param {string} [key] 如果提供key，则返回制定route key的路由配置信息
 * @returns {object}
 */
export function useRoutes (key) {
  return key ? routes[key] : routes
}

// 收集路由角色信息
let roles = {}
/**
 * 保存或读取route role信息
 * @param {string} [role] 如果不传则默认返回normal
 * @returns {string}
 */
function routeRole (role = 'normal') {
  if (roles) {
    roles[role] = undefined
  }
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
 * 根据路由角色选择该角色分组下路由集合
 * @param {string} [role=normal]
 * @returns {RouteParcel[] | ReactNode[]} 如果路由配置集合已经被渲染成路由组件，则会返回路由组件集合
 */
export function useRouteComponents (role = routeRole()) {
  transform()
  return RouteShelves[role] || []
}
/**
 * 存放路由集合
 * @param {ReactNode[] | RouteParcel[]} parcels
 * @param {string} [role]
 * @returns {ReactNode[] | RouteParcel[]} parcels
 */
function shelveRoutes (parcels, role = routeRole()) {
  if (role && parcels) {
    RouteShelves[role] = parcels
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
  const target = RouteShelves[role] = RouteShelves[role] || []
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
  pickRoute () {}
}
/**
 * 返回自定义路由
 * @callback pickRoute
 * @param route 路由配置属性对象
 * @returns {Route|function|undefined}
 */
/**
 * 告诉路由模块使用自定义路由
 * @param {pickRoute} pickRoute
 */
export function useCustomRoute (pickRoute = () => {}) {
  transformOptions.pickRoute = pickRoute
}
/**
 * 将路由配置信息转换成路由组件
 */
export default function transform () {
  // 根据路由角色进行遍历，并将路由配置信息转换成路由组件
  roles && Object.keys(roles).forEach(role => {
    const parcels = RouteShelves[role]
    if (Array.isArray(parcels)) {
      /**
       * 默认用嵌套路由，其他使用扁平路由
       */
      const arrRoutesToReactRoutes = (role === routeRole() ? arrRoutesToNestingRoutes : arrRoutesToFlatRoutes)
      shelveRoutes(
        arrRoutesToReactRoutes(parcels, transformOptions),
        role
      )
    }
  })
  // 转换完成后清空，避免外部重复调用
  roles = undefined
}
