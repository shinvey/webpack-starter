import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import ErrorBoundary from './ErrorBoundary'

import { Navigation as IndexNav, Content as IndexContent } from './Index'
import { Navigation as AboutNav, Content as AboutContent } from './About'
import { Navigation as UsersNav, Content as UsersContent } from './Users'

/**
 * 考虑复杂的菜单用例
 * 树形菜单
 * 菜单可以定制
 * 内容container可以定制
 *
 * Note: React的Suspense组件容易导致浏览器标签页CPU飙升
 */

function AppRouter () {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <IndexNav/>
          </li>
          <li>
            <AboutNav/>
          </li>
          <li>
            <UsersNav/>
          </li>
        </ul>
      </nav>

      <ErrorBoundary>
        <IndexContent/>
        <AboutContent/>
        <UsersContent/>
      </ErrorBoundary>
    </Router>
  )
}

export default AppRouter
