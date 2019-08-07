import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import MainFrame from './MainFrame'
import ErrorBoundary from './deps/ErrorBoundary'

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
        <MainFrame />
      </ErrorBoundary>
    </Router>
  )
}
