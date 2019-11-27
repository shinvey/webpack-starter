import { setup } from 'sunny-js/request/ajaxPromise'
import ajaxSetup from './ajaxSetup'
import requestChannel, { createAction } from './channel'
export * from 'sunny-js/request/ajaxPromise'
setup(ajaxSetup)

/**
 * 会触发loading的请求
 * @param {Promise} ajax
 * @param assert
 * @returns {*}
 */
export function ajaxWithLoading (ajax, assert) {
  if (assert) {
    requestChannel.next(createAction('loading', assert))
    ajax.finally(() => requestChannel.next(createAction('loading', false)))
  }
  return ajax
}
