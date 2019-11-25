import React from 'react'
import {
  Router,
  Switch,
  Route,
} from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
import history from './history'
import viewScanner from '@/views/viewScanner'
// import viewScanner, { routerPath } from '@/views/viewScanner'
import ErrorBoundary from '../components/ErrorBoundary'
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
const routes = {}
const customContents = []
const contents = viewScanner({
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

    const MyRoute = route.auth ? AuthRoute : Route
    /**
     * 用Route组件给View视图传值
     * 为什么不用component https://reacttraining.com/react-router/web/api/Route/component
     * because you will get undesired component unmounts/remounts.
     */
    return <MyRoute {...route} routes={routes} render={props => <Content {...props} routes={routes} />} />
  }
})

/**
 * 考虑复杂的菜单用例
 * 树形菜单
 * 菜单可以定制
 * 内容container可以定制
 *
 * Note: React的Suspense组件容易导致浏览器标签页CPU飙升
 */

/**
 * 单页应用装配
 * 这是个页面容器page container
 * useMemo vs memo https://github.com/facebook/react/issues/14616
 */
export default function Container () {
  return (
    <Router history={history}>
      <ErrorBoundary>
        <Provider store={store}>
          <Switch>
            {contents}
            {customContents}
            <Route path={'*'}>
              404
              {/* 或者跳转到专门为此设计的404页面 */}
            </Route>
          </Switch>
        </Provider>
      </ErrorBoundary>
    </Router>
  )
}
