import { syncStateExtension } from './SyncState'
import { configureStore } from '../Container/store'

/**
 * 创建store
 * @param {object} options
 * @param {object} options.reducerMap
 * @param {object} options.preloadedState
 * @param {Function} options.enhancer
 * @param {Array} options.epics
 * @returns {IModuleStore}
 */
export default function createStore ({ reducerMap, preloadedState: initialState, enhancer, epics }) {
  const enhancers = []
  enhancer && enhancers.push(enhancer)
  return configureStore(
    {
      initialState,
      enhancers,
      extensions: [syncStateExtension()],
    },
    {
      id: 'elderAPP',
      reducerMap,
      epics,
    },
  )
}
