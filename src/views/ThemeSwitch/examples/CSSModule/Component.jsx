import React, { useState } from 'react'
import { ThemeLoader } from '../../index'
import classNames from '@/views/utils/classNames'
import css from './style.module.scss'

const themes = {
  light: () => import('./style.light.module.scss'),
  dark: () => import('./style.dark.module.scss')
}

export default function Component () {
  const [themeCSS, setTheme] = useState({})
  return <>
    <ThemeLoader
      themes={themes}
      onChange={setTheme}
    />
    <div className={classNames(css.component, themeCSS.component)}>
      Switch theme demo via CSS Module
    </div>
  </>
}
