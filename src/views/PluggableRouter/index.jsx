import React from 'react'
import {
  Router,
  Route,
} from 'react-router-dom'
import history from './history'
import viewScanner from './viewScanner'
// import viewScanner, { routerPath } from '@/views/viewScanner'
import AuthRoute from '../Auth/AuthRoute'

/**
 * 载入当前page下所有视图索引，创建routes and contents
 * 这里完全可决定是否要把所有路由信息以怎样的数据结构传给所有视图
 */
// const routes = []
/**
 * 如果想以对象形式创建路由表
 * 可以考虑在视图接口的navigation上添加id属性作为对象的key
 */
export const routes = {}
export const customContents = []
export const contents = viewScanner({
  iteratee (ViewModule, modulePath) {
    const {
      // 视图接口暴露的Content
      Content,
      // 视图接口暴露的route配置
      route
    } = ViewModule

    // routes.push(route)
    routes[route.key] = route

    // 如果想把每个视图接口文件的路径作为router path，可以考虑处理ViewModule.modulePath路径信息
    // return <Route path={routerPath(modulePath)} component={Content} />

    // 自定义Content渲染方式，用于处理更复杂灵活多变的需求
    // return <Content key={key} routes={routes} />
    if (route.custom) {
      customContents.push(<Content {...route} routes={routes} />)
      return
    }

    // 批量创建Route
    const MyRoute = route.auth ? AuthRoute : Route
    /**
     * 用Route组件给View视图传值
     * 为什么不用component https://reacttraining.com/react-router/web/api/Route/component
     * because you will get undesired component unmounts/remounts.
     */
    return <MyRoute {...route} routes={routes} render={props => <Content {...props} route={route} routes={routes} />} />
  }
})

/**
 * 可拔插路由
 */
export default function PluggableRouter ({ children }) {
  return <Router history={history}>{children}</Router>
}
