import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux-dynamic-modules-core'
import { getObservableExtension } from 'redux-dynamic-modules-observable'
import { getThunkExtension } from 'redux-dynamic-modules-thunk'
import MainFrame from './MainFrame'
import ErrorBoundary from './deps/ErrorBoundary'
// import { getThemeModule } from '@/views/components/SwitchTheme/redux/module'

const store = createStore(
  {
    extensions: [
      getThunkExtension(),
      getObservableExtension()
    ]
  },
  // getThemeModule()
)

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
 * @returns {*}
 * @constructor
 */
export default function Container () {
  return (
    <Router>
      <ErrorBoundary>
        <Provider store={store}>
          <MainFrame />
        </Provider>
      </ErrorBoundary>
    </Router>
  )
}
