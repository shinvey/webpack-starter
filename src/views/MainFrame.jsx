import React from 'react'
import { Link } from 'react-router-dom'
// @ant-design/pro-layout https://github.com/ant-design/ant-design-pro-layout/blob/master/README.zh-CN.md
// import BasicLayout from '@ant-design/pro-layout'
// 载入当前page下所有视图索引，创建routes and contents，交由basic layout渲染

// webpack require.context api https://github.com/webpack/docs/wiki/context
const req = require.context('./', true, /\w+View\/index\.[a-z]+$/i)
const routes = []
// const routes = {}
const contents = []
req.keys().forEach(modulePath => {
  const ViewModule = req(modulePath)
  const Content = ViewModule.Content
  const key = ViewModule.navigation.name
  routes.push(ViewModule.navigation)
  // routes[modulePath.replace(/\/index\.[a-z]+$/i, '')] = ViewModule.navigation
  contents.push(<Content key={key} routes={routes} />)
})

function BasicLayout (props) {
  const { navigations } = props
  return <div>
    {/* <b>所有视图接口：</b> */}
    {/* <ul> */}
    {/*  {navigations.map((nav, key) => <li key={key}><Link to={nav.path}>{nav.name}</Link></li>)} */}
    {/* </ul> */}
    {/* <b>当前视图内容：</b> */}
    {props.children}
  </div>
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
  const { children } = props
  return <BasicLayout navigations={routes}>
    {children}
    {contents}
  </BasicLayout>
}
