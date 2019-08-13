import React from 'react'
import { Link } from 'react-router-dom'
// @ant-design/pro-layout https://github.com/ant-design/ant-design-pro-layout/blob/master/README.zh-CN.md
// import BasicLayout from '@ant-design/pro-layout'
// 载入当前page下所有视图索引，创建routes and contents，交由basic layout渲染

// webpack require.context api https://github.com/webpack/docs/wiki/context
const req = require.context('./', true, /\w+View\/index\.[a-z]+$/i)
const routes = []
const contents = []
req.keys().forEach(modulePath => {
  const ViewModule = req(modulePath)
  const Content = ViewModule.Content
  const key = ViewModule.navigation.name
  routes.push(ViewModule.navigation)
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
    breadcrumbRender={(routers = []) => {
      const HomeViewModule = req('./HomeView')
      return [
        {
          path: HomeViewModule.navigation.path,
          breadcrumbName: HomeViewModule.navigation.name
        },
        ...routers
      ]
    }}
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
