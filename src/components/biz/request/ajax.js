// import stringify from 'qs/lib/stringify'
import { throwError } from 'rxjs/index'
import { ajax as rxjsAjax } from 'rxjs/ajax/index'
import { tap, catchError } from 'rxjs/operators/index'

/**
 * 处理请求底层公用逻辑
 * 1. 携带token
 * 2. 处理公共接口错误码
 * 3. 公共异常处理
 *
 * 业务逻辑层只处理私有异常和正常相应数据
 * @param Object options
 * @returns {Observable<any>}
 */
export default function ajax ({ headers = {}, body, ...rest }) {
  // multipart/form-data对象应对文件上传等需求
  // 不定义headers Content-Type 默认会按照application/x-www-form-urlencoded方式处理
  if (body instanceof FormData) {
    headers['Content-Type'] = 'multipart/form-data'
  }
  return rxjsAjax({
    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials
    withCredentials: true,
    // responseType: 'json', // rxjs默认使用json parser
    headers: {
      'X-API-TOKEN': 'xxx',
      ...headers
    },
    body, // body instanceof FormData ? data : stringify(data),
    ...rest
  }).pipe(
    tap(ajaxResponse => {
      const response = ajaxResponse.response
      console.log('Low level response emit ', response)

      // 处理业务接口公共错误码，并抛出异常
      // todo 创建业务异常对象
      // if (response.id === 1) throw new Error('Business Error')
    }),
    catchError(error => {
      // console.error('Low level error emit ', error)

      // 通用网络异常处理
      // todo 创建网络异常对象
      // do something with network error

      // 继续将错误抛出，允许当前stream上的其他pipe也可以捕获异常，并作自定义处理
      return throwError(error)
    }),
    catchError(error => {
      // console.error('Low level error emit ', error)

      // 通用业务异常处理
      // todo 与UI组件解耦合
      // do something with business error

      // 继续将错误抛出，允许当前stream上的其他pipe也可以捕获异常，并作自定义处理
      return throwError(error)
    })
  )
}

/**
 * ajax快捷方法代理函数
 * @param {function} call
 * @param {string} method
 * @param {string} url
 * @param {object|FormData} body
 * @param {object} options 第三个options参数可以参照官方用例 https://rxjs.dev/api/ajax/ajax#using-ajax-with-object-as-argument-and-method-post-with-a-two-seconds-delay-
 * @returns {*}
 */
export function shorthandMethod (call, method, url, body, options = {}) {
  options.url = url
  options.body = body
  options.method = method
  return call(options)
}
/**
 * ajax get 快捷方法
 * @example
 * get('http://example', { field: 'value' }).subscribe(ajaxResponse => {})
 */
export function get (/* url, body, options */ ...args) {
  return shorthandMethod(ajax, 'GET', ...args)
}
/**
 * ajax get 快捷方法
 * @example
 * post('http://example', { field: 'value' }).subscribe(ajaxResponse => {})
 */
export function post (/* url, body, options */ ...args) {
  return shorthandMethod(ajax, 'POST', ...args)
}
