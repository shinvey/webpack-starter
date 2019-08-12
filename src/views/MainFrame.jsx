import React from 'react'
import { Link } from 'react-router-dom'
// @ant-design/pro-layout https://github.com/ant-design/ant-design-pro-layout/blob/master/README.zh-CN.md
// import BasicLayout from '@ant-design/pro-layout'
// 载入当前page下所有视图索引，创建routes and contents，交由basic layout渲染
import * as views from './view-impl.js'
const routes = []
const contents = []
Object.keys(views).forEach(moduleName => {
  const view = views[moduleName]
  const Content = view.Content
  const key = view.navigation.name
  routes.push(view.navigation)
  contents.push(<Content key={key} />)
})

function BasicLayout (props) {
  return <div>{props.children}</div>
}
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
export default function MainFrame (props) {
  const { children, settings } = props
  return <BasicLayout
    logo={'https://webassets.4it02a.top/common/bob.ico'}
    title={'Full Time Admin'}
    menuItemRender={(menuItemProps, defaultDom) => (
      <Link to={menuItemProps.path}>{defaultDom}</Link>
    )}
    breadcrumbRender={(routers = []) => [
      {
        path: views.HomeView.navigation.path,
        breadcrumbName: views.HomeView.navigation.name
      },
      ...routers
    ]}
    {...props}
    {...settings}
    // route用法 https://pro.ant.design/blog/new-pro-use-cn
    route={{
      routes: routes
    }}
  >
    {children}
    {contents}
  </BasicLayout>
}
