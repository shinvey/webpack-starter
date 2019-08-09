import ajax, { shorthandMethod } from './ajax.js'
import { tap, catchError } from 'rxjs/operators'
import { EMPTY } from 'rxjs'

export default function ajaxPromise (options) {
  return new Promise((resolve, reject) => {
    ajax(options)
      .pipe(
        tap(resolve, reject),
        /**
         * Observable that immediately completes.
         * 异常已经交由promise处理，stream到此结束
         */
        catchError(() => EMPTY)
      )
      // 让这个stream run起来
      .subscribe()
  })
}
/**
 * ajax get 快捷方法
 * @example
 * get('http://example', { field: 'value' }).then(ajaxResponse => {}).catch(error => {})
 */
export function get (/* url, body, options */ ...args) {
  return shorthandMethod(ajaxPromise, 'GET', ...args)
}
/**
 * ajax post 快捷方法
 * @example
 * post('http://example', { field: 'value' }).then(ajaxResponse => {}).catch(error => {})
 */
export function post (/* url, body, options */ ...args) {
  return shorthandMethod(ajaxPromise, 'POST', ...args)
}
