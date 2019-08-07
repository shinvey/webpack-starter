import React from 'react'
import { Link } from 'react-router-dom'
// @ant-design/pro-layout https://github.com/ant-design/ant-design-pro-layout/blob/master/README.zh-CN.md
import BasicLayout from '@ant-design/pro-layout'
// 首页View
import { navigation as homeRoute, Content as HomeContent } from './Home'
// 其他需要动态加载的View
// todo 完成自动扫描所有View接口
// todo 将navigation和Content注入MainFrame
// todo 再考虑MainFrame是否要和Container进行合并简化结构

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
        path: homeRoute.path,
        breadcrumbName: homeRoute.name
      },
      ...routers
    ]}
    {...props}
    {...settings}
    // route用法 https://pro.ant.design/blog/new-pro-use-cn
    route={{
      routes: [
        homeRoute
      ]
    }}
  >
    {children}
    <HomeContent />
  </BasicLayout>
}
