import React from 'react'
import AboutUs from './AboutUs'
import { viewModule } from './redux/module'
import { DynamicModuleLoader } from 'redux-dynamic-modules-react'

export default function View (props) {
  return <DynamicModuleLoader modules={[viewModule()]}>
    <AboutUs />
  </DynamicModuleLoader>
}
