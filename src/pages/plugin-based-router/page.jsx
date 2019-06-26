import React from 'react'
import ReactDOM from 'react-dom'
import AppRouter from './AppRouter.jsx'

const wrapper = document.getElementById('app')
wrapper && ReactDOM.render(<AppRouter />, wrapper)
