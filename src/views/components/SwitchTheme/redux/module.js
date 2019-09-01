import themeReducer from './themeReducer'
import themeEpic from './themeEpic'
import { initThemes, setThemeActionCreator } from './actions'
import themes from './themes'

export function getThemeModule () {
  return {
    // Unique id of the module
    id: 'theme',
    // Maps the Store key to the reducer
    reducerMap: {
      switchTheme: themeReducer
    },
    epics: [themeEpic],
    // Optional: Any actions to dispatch when the module is loaded
    initialActions: [{ type: initThemes, payload: themes }, setThemeActionCreator()],
    // Optional: Any actions to dispatch when the module is unloaded
    finalActions: []
  }
}
