import React from 'react'
import { DynamicModuleLoader } from 'redux-dynamic-modules-react'
import Setting from './Setting'
// 主题设置Redux Module一般是全局module，需要全局载入。这里载入只是为了展示demo
import { getThemeModule } from '@/views/components/SwitchTheme/redux/module'

export default function View (props) {
  return <DynamicModuleLoader modules={[getThemeModule()]}>
    <Setting />
  </DynamicModuleLoader>
}
