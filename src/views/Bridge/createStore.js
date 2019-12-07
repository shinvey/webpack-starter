import { applyMiddleware } from 'redux'
import { syncMiddleware } from './SyncState'
import { configureStore } from '../Container/store'

/**
 * 创建store
 * @param {object} options
 * @param {object} options.reducerMap
 * @param {object} options.initialState
 * @param {Function} options.enhancer
 * @param {Array} options.epics
 * @returns {IModuleStore}
 */
export default function createStore ({
  reducerMap,
  preloadedState: initialState,
  enhancer,
  epics
}) {
  const enhancers = [
    applyMiddleware(syncMiddleware),
  ]
  enhancer && enhancers.push(enhancer)
  return configureStore({
    initialState,
    enhancers
  }, {
    id: 'elderAPP',
    reducerMap,
    epics,
  })
}
