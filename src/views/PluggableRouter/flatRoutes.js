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
export function flatRoutes (arrRoutes, options) {
  const { props: crossProps = {}, pickRoute = route => Route } = options
  return arrRoutes.map(({ route, Content }, index) => {
    /**
     * 批量创建Route
     *
     * 为什么不用component https://reacttraining.com/react-router/web/api/Route/component
     * because you will get undesired component unmounts/remounts.
     *
     * 关于嵌套路由的生成请移至readme.md文档 [如何生成嵌套路由？](./readme.md#nested-routes)
     */
    return createElement(pickRoute(route), {
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
    })
  })
}
