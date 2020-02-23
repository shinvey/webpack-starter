/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */

import ProLayout, { BasicLayoutProps, } from '@ant-design/pro-layout'
import React, { useState } from 'react'
import defaultSettings from '@ant-design/pro-layout/es/defaultSettings'
import { Link } from 'react-router-dom'

const settings = {
  ...defaultSettings,
  fixSiderbar: true,
}

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const [collapsed, handleMenuCollapse] = useState<boolean>(false)
  return <ProLayout
    onCollapse={handleMenuCollapse}
    menuItemRender={(menuItemProps, defaultDom) =>
      menuItemProps.isUrl ? (
        defaultDom
      ) : (
        <Link className="qixian-menuItem" to={menuItemProps.path || '/'}>
          {defaultDom}
        </Link>
      )
    }
    collapsed={collapsed}
    {...settings}
    {...props}
  >
    {props.children}
  </ProLayout>
}

export default BasicLayout
