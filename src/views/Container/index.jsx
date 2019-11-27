import React from 'react'
import { Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
import PluggableRouter, { routes } from '../PluggableRouter'
import Content from './Content'
import Layout from '../Layout'

/**
 * 内容container可以定制
 * Note: React的Suspense组件容易导致浏览器标签页CPU飙升
 */

/**
 * 单页应用装配
 * 这是个页面容器page container
 * useMemo vs memo https://github.com/facebook/react/issues/14616
 * todo 抽象布局方案，Layout组件肯定不能满足多样化的布局
 */
export default function Container () {
  return (
    <PluggableRouter>
      <Provider store={store}>
        <Layout routes={routes}>
          <Content>
            <Route path={'*'}>
              404
              {/* 或者跳转到专门为此设计的404页面 */}
            </Route>
          </Content>
        </Layout>
      </Provider>
    </PluggableRouter>
  )
}
