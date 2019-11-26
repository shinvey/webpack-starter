import { createStore } from 'redux-dynamic-modules-core'
import { getObservableExtension } from 'redux-dynamic-modules-observable'
import { getThunkExtension } from 'redux-dynamic-modules-thunk'
// import { getThemeModule } from '@/views/components/SwitchTheme/redux/module'

/**
 * 配置store
 * @param {object} [options]
 * @param {object} [options.initialState]
 * @param {Array} [options.extensions]
 * @param {Array} [options.enhancers]
 * @param {...object} [reduxModule]
 * @returns {IModuleStore}
 */
export function configureStore (options = {}, ...reduxModule) {
  const {
    initialState = {},
    extensions = [],
    enhancers = []
  } = options
  return createStore(
    {
      initialState,
      extensions: [
        getThunkExtension(),
        getObservableExtension(),
        ...extensions
      ],
      enhancers
    },
    /**
     * 公用redux module
     */
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
    },
    ...reduxModule
  )
}

export default configureStore()
