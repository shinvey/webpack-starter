import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import Navigation from './Navigation'
import Content from './Content'

/**
 * 考虑复杂的菜单用例
 * 树形菜单
 * 菜单可以定制
 * 内容container可以定制
 *
 * Note: React的Suspense组件容易导致浏览器标签页CPU飙升
 */

export default function App () {
  return (
    <Router>
      <Navigation/>
      <Content/>
    </Router>
  )
}
