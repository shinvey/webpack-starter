/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */

import ProLayout, {
  BasicLayoutProps,
  SettingDrawer,
  Settings,
} from '@ant-design/pro-layout'
import React, { useState } from 'react'
import defaultSettings from '@ant-design/pro-layout/es/defaultSettings'
import { Link } from 'react-router-dom'

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const [collapsed, handleMenuCollapse] = useState<boolean>(false)
  const [settings, setSettings] = useState<Partial<Settings>>({
    ...defaultSettings,
    fixSiderbar: true,
  })
  return (
    <>
      <ProLayout
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
      {
        /**
         * SettingDrawer 提供了一个图形界面来设置 layout 的配置。不建议在正式环境中使用。
         * https://github.com/ant-design/ant-design-pro-layout/blob/master/README.zh-CN.md#settingdrawer
         */
      }
      {process.env.IS_DEV && <SettingDrawer
        // hideLoading
        // hideCopyButton
        // hideHintAlert
        settings={settings}
        onSettingChange={config => setSettings(config)}
      />}
    </>
  )
}

export default BasicLayout
