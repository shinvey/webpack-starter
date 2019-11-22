import React from 'react'
import { render } from 'react-dom'
import Container from './Container.jsx'

// 启用react hot loader https://github.com/gaearon/react-hot-loader
import { setConfig } from 'react-hot-loader'
import { hot } from 'react-hot-loader/root'
setConfig({
  // trackTailUpdates: false,
  // pureRender: true
  // allowSFC: true
  // ignoreSFC: true
  // disableHotRendererWhenInjected: true
  // disableHotRenderer: true
})
const App = env.hot ? hot(() => <Container />) : Container

const wrapper = document.getElementById('app')
wrapper && render(<App />, wrapper)
