import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
import viewScanner from '@/views/viewScanner'
// import viewScanner, { routerPath } from '@/views/viewScanner'
import ErrorBoundary from './components/ErrorBoundary'

/**
 * 载入当前page下所有视图索引，创建routes and contents
 * 这里完全可决定是否要把所有路由信息以怎样的数据结构传给所有视图
 */
const routes = []
/**
 * 如果想以对象形式创建路由表
 * 可以考虑在视图接口的navigation上添加id属性作为对象的key
 */
// const routes = {}
const contents = viewScanner({
  iteratee (ViewModule, modulePath) {
    // 视图接口暴露的Content
    const Content = ViewModule.Content
    // 视图接口暴露的navigation
    const key = ViewModule.navigation.name
    routes.push(ViewModule.navigation)

    // 如果想把每个视图接口文件的路径作为router path，可以考虑处理ViewModule.modulePath路径信息
    // return <Route path={routerPath(modulePath)} component={Content} />

    // 自定义Content渲染方式，比如传入所有路由信息，可以被子视图所使用
    return <Content key={key} routes={routes} />
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
 * @returns {*}
 * @constructor
 */
export default function Container () {
  return (
    <Router>
      <ErrorBoundary>
        <Provider store={store}>
          {contents}
        </Provider>
      </ErrorBoundary>
    </Router>
  )
}
