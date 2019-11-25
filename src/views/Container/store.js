import { createStore } from 'redux-dynamic-modules-core'
import { getObservableExtension } from 'redux-dynamic-modules-observable'
import { getThunkExtension } from 'redux-dynamic-modules-thunk'
// import { getThemeModule } from '@/views/components/SwitchTheme/redux/module'

export function configureStore () {
  return createStore(
    {
      extensions: [
        getThunkExtension(),
        getObservableExtension()
      ]
    },
    // getThemeModule()
    {
      id: 'user-module',
      reducerMap: {
        user (state, action) {
          if (action.type === 'user/update') {
            state.token = action.payload.token
          } else {
            state = state || {
              token: undefined
            }
          }
          return state
        }
      }
    }
  )
}

export default configureStore()
