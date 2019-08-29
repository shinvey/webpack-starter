import React from 'react'
import { ConnectedHackerNews } from './component/hacker-news-component'
import { getHackerNewsModule } from './redux/module'
import { DynamicModuleLoader } from 'redux-dynamic-modules-react'

export default function View (props) {
  return <DynamicModuleLoader modules={[getHackerNewsModule()]}>
    <ConnectedHackerNews />
  </DynamicModuleLoader>
}
