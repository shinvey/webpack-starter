import { useCustomGetRole } from '../Auth/ACL/AccessControl'
import { userInfo } from '@/views/Auth'
import { useRoutes } from '@/views/PluggableRouter'
import { useCustomGetRoutes } from '@/views/Auth/ACL/PermissionManager'
import { useCustomLoading, useCustomRoute } from '../PluggableRouter'
import Loading from '../components/Loading'
import AuthRoute from '../Auth/AuthRoute'
import { Route } from 'react-router'
import { useCustomFetchPermissions } from '@/views/Auth/ACL/service'
import permissions from './permissions.config'
import { isStr } from 'sunny-js/util/string'
import { loadFromStorage, saveToSession } from 'sunny-js/util/storage'

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
  // 后台管理项目默认启用认证路由
  // 适用于后台管理
  return route.auth === false ? Route : AuthRoute
  // 适用于前端web应用
  // return route.auth ? AuthRoute : Route
})
useCustomGetRole(() => {
  return userInfo().role || 'guest'
})
// useCustomGetRoutePath<PluggableRoute>(route => route.getNest())
useCustomGetRoutes(() => Object.values(useRoutes()))
useCustomFetchPermissions(
  () => Promise.resolve(permissions),
  keyOrData => {
    if (isStr(keyOrData)) {
      // 开发环境不缓存。返回undefined表示无缓存
      return process.env.IS_PRD ? loadFromStorage('ACLPermissions') : undefined
    } else {
      saveToSession({ ACLPermissions: keyOrData })
    }
  }
)
