export const namespace = 'theme'
export const setTheme = namespace + '/setTheme'
export const asyncSetTheme = namespace + '/asyncSetTheme'
export const initThemes = namespace + '/initThemes'
export const loadThemes = namespace + '/loadThemes'

export function setThemeActionCreator(payload) {
  payload = payload || localStorage.getItem(namespace) || 'default'
  localStorage.setItem(namespace, payload)
  return {
    type: setTheme,
    payload
  }
}
