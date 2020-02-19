// 启用react hot loader https://github.com/gaearon/react-hot-loader
import { hot } from 'react-hot-loader/root'
import React from 'react'
import { render } from 'react-dom'
import Container from './Container'
import { useElement } from 'sunny-js/util/DOM'

const App = module.hot ? hot(() => <Container />) : Container
const containerID = 'app-container'
render(<App />, useElement('#' + containerID, { id: containerID }))
