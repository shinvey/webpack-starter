import produce from 'immer'
import { setTheme, initThemes, namespace } from './actions'

export default function themeReducer(
  state: any = {},
  action: Action
) {
  return produce(state || {}, draft => {
    switch (action.type) {
      // 设置主题
      case setTheme:
        draft.theme = state.themes[action.payload]
        break
      case initThemes:
        draft.themes = action.payload
        break
    }
  })
}
