import React from 'react'
import ThemeSwitch from '../ThemeSwitch'
import SwitchThemeCSSModuleComponent from '../ThemeSwitch/examples/CSSModule/Component'
import SwitchThemePlainCSSComponent from '../ThemeSwitch/examples/PlainCSS/Component'
import SwitchThemeCombinedCSSModuleComponent from '../ThemeSwitch/examples/CombinedCSSModule/Component'
import SwitchThemeCombinedPlainCSSComponent from '../ThemeSwitch/examples/CombinedPlainCSS/Component'

export default function View ({ route, routes }) {
  return <div data-page={route.key}>
    <ThemeSwitch
      onChange={theme => console.log('主题已经切换至' + theme)}
      loading={() => console.log('主题加载中')}
      onError={() => console.error('主题加载失败')}
      theme={'dark'}
    >
      {({ change, theme }) =>
        <button onClick={() => change(theme !== 'dark' ? 'dark' : 'light')}>
          {theme} theme
        </button>
      }
    </ThemeSwitch>
    <SwitchThemeCSSModuleComponent />
    <SwitchThemePlainCSSComponent />
    <SwitchThemeCombinedCSSModuleComponent />
    <SwitchThemeCombinedPlainCSSComponent />
  </div>
}
