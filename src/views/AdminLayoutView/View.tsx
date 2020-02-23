import React from 'react'
import BasicLayout from './BasicLayout'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { Redirect, useHistory } from 'react-router'
import { Switch } from '../PluggableRouter'
import logo from './logo.svg'
import menuData from './menuData'

export default function View ({ route, routes, children }) {
  const history = useHistory()
  const currentRoutePath = route.toPath()
  const welcomeRoutePath = routes.welcome ? routes.welcome.toPath() : '/'

  /**
   * pro-layout
   * 更多配置选项参见 https://prolayout.ant.design/index
   * 代码用例 https://github.com/ant-design/ant-design-pro-layout/blob/master/example/src/layouts/BasicLayout.tsx
   */
  return <>
    <BasicLayout
      logo={logo}
      title={'管理后台'}
      onMenuHeaderClick={e => {
        e.preventDefault()
        history.push(currentRoutePath)
      }}
      menuDataRender={() => menuData}
    >
      <PageHeaderWrapper />
      <Switch>
        <Redirect to={welcomeRoutePath} from={currentRoutePath} exact={true} />
        {children}
      </Switch>
    </BasicLayout>
  </>
}
