import React from 'react'
import { addTheme } from '../../index'
import './style.scss'

addTheme({
  light: () => import('./style.light.scss'),
  dark: () => import('./style.dark.scss')
})

export default function Component () {
  return <div className={'component'}>Switch theme demo via plain CSS</div>
}
