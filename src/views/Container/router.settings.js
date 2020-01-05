import { useCustomLoading, useCustomRoute } from '../PluggableRouter'
import Loading from '../components/Loading'
import AuthRoute from '../Auth/AuthRoute'
import { Route } from 'react-router'

/**
 * 使用自定义loading组件
 */
useCustomLoading(Loading)
/**
 * 为PluggableRouter模块，使用自定义路由组件
 * 自定义选择路由组件的逻辑，可以为路由增加特别功能
 * 这里我们为路由配置增加了一个auth认证功能
 */
useCustomRoute(route => {
  return route.auth ? AuthRoute : Route
})
