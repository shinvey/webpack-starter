import { createElement } from 'react'
import { Route } from 'react-router-dom'

/**
 * 生成扁平化的路由组件数组
 * @param {array} arrRoutes
 * @param {object} [options]
 * @param {object} [options.props] 给路由组件和子组件传递的参数
 * @param {function} [options.pickRoute] 路由选择器
 * @returns {*}
 */
export function arrRoutesToFlatRoutes (arrRoutes, options) {
  const { props: crossProps = {}, pickRoute } = options
  const RouteComponents = []
  const iteratee = ({ route, Content }, index) => {
    /**
     * 批量创建Route
     *
     * 为什么不用component https://reacttraining.com/react-router/web/api/Route/component
     * because you will get undesired component unmounts/remounts.
     *
     * 关于嵌套路由的生成请移至readme.md文档 [如何生成嵌套路由？](./readme.md#nested-routes)
     */
    RouteComponents.push(createElement(pickRoute(route) || Route, {
      ...crossProps,
      route,
      key: index,
      ...route,
      render (routeProps) {
        return createElement(Content, {
          // 用Route组件给View视图传值
          ...crossProps,
          route,
          ...routeProps
        })
      }
    }))
  }
  flatRoutesByPath(arrRoutes, iteratee)
  return RouteComponents
}

/**
 * 拆解route path为数组类型的路由配置
 * @param {routeProps[]} arrRoutes
 * @param {function} iteratee
 * @example
 * const route = { key: 'key', path: ['path1', 'path2'] }
 * // 将会被拆解成
 * const route = { key: 'key0', path: 'path1' }
 * const route = { key: 'key1', path: 'path2' }
 */
export function flatRoutesByPath (arrRoutes, iteratee) {
  arrRoutes = [...arrRoutes] // clone array. Which one is fastest? http://jsben.ch/lO6C5

  let config
  let arrRoutesIndex = 0
  do {
    config = arrRoutes.shift()

    // 如果config为undefined，则表示可以结束while循环
    if (!config) continue

    const { route, Content } = config
    if (Array.isArray(route.path)) {
      // 如果route path为数组类型，创建不同path的route配置副本
      route.path.forEach((path, pathIndex) => {
        const derivedRoute = Object.assign({}, route)
        derivedRoute.key = derivedRoute.key + pathIndex // 防止key重名
        derivedRoute.path = path
        delete derivedRoute.nest
        if (Array.isArray(route.nest) && route.nest[pathIndex]) {
          derivedRoute.nest = route.nest[pathIndex]
        } else if (route.nest && pathIndex === 0) {
          // 如果nest属性不是数组，那么将只会应用到第一个path
          derivedRoute.nest = route.nest
        }
        iteratee({
          route: derivedRoute,
          Content
        }, ['route', arrRoutesIndex, '-', 'path', pathIndex].join(''))
      })
    } else {
      iteratee(config, ['route', arrRoutesIndex].join(''))
    }

    // 循环次数加一
    ++arrRoutesIndex
  } while (config)
}
