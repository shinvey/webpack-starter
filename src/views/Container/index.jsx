import React from 'react'
import { Route } from 'react-router'
import { Provider } from 'react-redux'
import store from './store'
import PluggableRouter from '../PluggableRouter'
import Content from './Content'

/**
 * 内容container可以定制
 * Note: React的Suspense组件容易导致浏览器标签页CPU飙升
 */

/**
 * 单页应用装配
 * 这是个页面容器page container
 * useMemo vs memo https://github.com/facebook/react/issues/14616
 */
export default function Container () {
  return (
    <PluggableRouter>
      <Provider store={store}>
        <Content>
          <Route path={'*'}>
            404
            {/* 或者跳转到专门为此设计的404页面 */}
          </Route>
        </Content>
      </Provider>
    </PluggableRouter>
  )
}
