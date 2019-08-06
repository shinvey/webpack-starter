import React from 'react'
import { render } from 'react-dom'
import Container from './Container.jsx'

const wrapper = document.getElementById('app')
wrapper && render(<Container />, wrapper)
