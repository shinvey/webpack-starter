import { compile } from 'path-to-regexp'
import loadable from 'react-loadable'
import viewScanner, { modulePathToDirPath } from './viewScanner'
import { arrRoutesToFlatRoutes } from './flatRoutes'
import { arrRoutesToNestingRoutes } from './nestingRoutes'

/**
 * @type {Function} loading函数组件
 */
let Loading
/**
 * 使用自定义Loading组件
 * @param {Function} fn
 */
export function useCustomLoading (fn) {
  Loading = fn
}

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

// 路由默认角色
const NORMAL_ROLE = 'normal'

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
export function useRouteComponents (role = NORMAL_ROLE) {
  transform()
  return RouteShelves[role] || []
}

/**
 * 存放路由集合
 * @param {ReactNode[] | RouteParcel[]} parcels
 * @param {string} [role]
 * @returns {ReactNode[] | RouteParcel[]} parcels
 */
function shelveRoutes (parcels, role = NORMAL_ROLE) {
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
function sortRoute (parcel, role = NORMAL_ROLE) {
  const target = RouteShelves[role] = RouteShelves[role] || []
  if (parcel.route && parcel.Content) {
    target.push(parcel)
  }
  return target
}
/**
 * 路由封装迭代函数
 * @param ESModule
 * @param modulePath
 */
function packRoute (ESModule, modulePath) {
  let route, Content
  if (ESModule.default) {
    route = ESModule.default
    // 如果传入content参数为import()实例，则用loadable封装
    Content = route.content instanceof Promise ? loadable({
      loader: () => route.content,
      loading: Loading,
    }) : route.content
  } else {
    // 视图接口暴露的route配置
    route = ESModule.route
    // 视图接口暴露的Content，不区分大小写
    Content = ESModule.Content || ESModule.content
  }

  if (!route || !Content) return // continue

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
  route.toPath = function (...args) {
    route.toPath.compiledPath = route.toPath.compiledPath || compile(
      Array.isArray(this.path) ? this.path[0] : this.path,
      { encode: encodeURIComponent }
    )
    return this.toPath.compiledPath(...args)
  }

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

  sortRoute({
    route,
    Content
  }, route.role)
}

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
 * @typedef {Function} transform
 * @property {boolean} __once__ 避免外部重复调用
 */
/**
 * 将路由配置信息转换成路由组件
 * 该函数仅执行一次
 */
function transform () {
  if (!transform.__once__) {
    transform.__once__ = true
    viewScanner(packRoute)
    // 根据路由角色进行遍历，并将路由配置信息转换成路由组件
    Object.keys(RouteShelves).forEach(role => {
      const parcels = RouteShelves[role]
      if (Array.isArray(parcels)) {
        /**
         * 默认用嵌套路由，其他使用扁平路由
         */
        const arrRoutesToReactRoutes = (role === NORMAL_ROLE ? arrRoutesToNestingRoutes : arrRoutesToFlatRoutes)
        shelveRoutes(
          arrRoutesToReactRoutes(parcels, transformOptions),
          role
        )
      }
    })
  }
}
