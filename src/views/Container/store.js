import { createStore } from 'redux-dynamic-modules-core'
import { getObservableExtension } from 'redux-dynamic-modules-observable'
import { getThunkExtension } from 'redux-dynamic-modules-thunk'
import { isFn } from 'sunny-js/util/function'

/**
 * @typedef {NodeRequire} require
 * @property {Function} context [webpack require.context](https://webpack.js.org/guides/dependency-management/#requirecontext)
 */

/**
 * 加载全局RDM
 * 将有名字的RDM视为全局RDM
 * 匿名RDM将作为局部RDM，有各个视图通过DynamicModuleLoader进行载入
 */
function globalRDM () {
  const req = require.context('../', true, /\w+RDM\/index\.[a-z]+$/i)
  return req.keys().map(path => {
    const RDM = req(path).default
    return isFn(RDM) ? RDM() : RDM
  })
}

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
  const { initialState = {}, extensions = [], enhancers = [] } = options
  return createStore(
    {
      initialState,
      extensions: [getThunkExtension(), getObservableExtension(), ...extensions],
      enhancers,
    },
    ...reduxModule,
    /**
     * 公用redux module
     */
    ...globalRDM(),
  )
}

export default configureStore()
