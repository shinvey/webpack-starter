import { useEffect, useState } from 'react'
import { trigger, on, off } from 'sunny-js/util/DOMEvent'
import { noop } from 'sunny-js/util/function'

const addedThemes = {}
const customEvent = 'theme'

export function addTheme (themes) {
  Object.keys(themes).forEach(theme => {
    const loaders = addedThemes[theme] = addedThemes[theme] || {}
    const loader = themes[theme]
    loaders[loader] = loader
  })
}

export function changeTheme (theme) {
  document.documentElement.setAttribute('data-theme', theme)
  // 触发主题切换事件
  trigger(customEvent, theme)
}

/**
 * 主题切换组件
 * css module theming https://github.com/css-modules/css-modules/blob/master/docs/theming.md#theming
 */
export default function ThemeSwitch ({
  children = noop,
  theme: defaultTheme,
  loading = noop,
  onError = noop,
  onChange = noop
}) {
  const [currentTheme, setTheme] = useState(defaultTheme)
  const change = theme => {
    // 动态加载主题样式文件
    let loaders = addedThemes[theme] || {}
    loaders = Object.values(loaders)
    if (loaders.length) {
      // 打开loading
      loading()
      Promise.all(loaders.map(getPromise => getPromise()))
        .then(() => {
          // 指定主题样式文件全部加载完毕
          changeTheme(theme)
          // 已经完成切换
          onChange(theme)
          setTheme(theme)
        })
        .catch((...args) => onError(...args))
    }
  }
  useEffect(() => change(currentTheme), [])
  return children({
    change,
    theme: currentTheme
  })
}

/**
 * 主题加载器
 * @return {null}
 */
export function ThemeLoader ({ themes, onChange = noop }) {
  useEffect(() => {
    // 添加到队列中
    // addedThemes.push(...Object.values(themes))
    addTheme(themes)
    // 样式加载完成后，且触发了主题切换事件
    const themeChanged = e => {
      // 直接读取已经加载好的css module样式
      const getPromise = themes[e.data]
      getPromise && getPromise().then(({ default: style }) => onChange(style))
    }
    on(customEvent, themeChanged)
    return () => off(customEvent, themeChanged)
  }, [])
  return null
}
