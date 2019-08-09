import React from 'react'
import { Route } from 'react-router-dom'
import loadable from '@loadable/component'
import Loading from '../../Loading'

/**
 * __视图接口职责__
 * 建议：
 * * export导航相关的配置信息
 * * export和路由规则绑定的视图组件
 * * 动态加载视图组件，实现基础的路由级的代码分离
 * * 依赖其他库时会增加initial bundle的大小，所以需要先拿出来讨论架构上的合理性后再做决定
 *
 * 可选：
 * * 如果当前视图需要用户认证，请直接使用Login/AuthRoute业务公用组件，与Route用法一致，
 * AuthRoute完成登录业务后会自动返回当前视图
 */

export const navigation = {
  path: '/login',
  name: '登录',
  hideInMenu: false
}
export function Content () {
  const View = loadable(() => import('./View'), {
    fallback: <Loading />
  })
  return <Route path={navigation.path} component={View} />
}
