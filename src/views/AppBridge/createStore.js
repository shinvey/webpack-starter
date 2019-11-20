import { applyMiddleware } from 'redux'
import { createStore } from 'redux-dynamic-modules-core'
import { getObservableExtension } from 'redux-dynamic-modules-observable'
import { getThunkExtension } from 'redux-dynamic-modules-thunk'
import { syncMiddleware } from './SyncState'

/**
 * 创建store
 * @param reducer
 * @param {object} [initialState]
 * @param [enhancer]
 * @param [epics]
 * @returns {IModuleStore<unknown>}
 */
export default ({
  reducerMap,
  preloadedState: initialState,
  enhancer,
  epics
}) => {
  const reduxModule = {
    id: 'elderAPP',
    reducerMap,
    epics,
  }
  return createStore(
    {
      initialState,
      extensions: [
        getThunkExtension(),
        getObservableExtension()
      ],
      enhancers: [
        applyMiddleware(syncMiddleware)
      ],
    },
    reduxModule
  )
}
