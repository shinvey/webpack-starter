import stringify from 'qs/lib/stringify'
import { throwError } from 'rxjs'
import { ajax as rxjsAjax } from 'rxjs/ajax'
import { tap, catchError } from 'rxjs/operators'
import BusinessError from '../../../library/Error/BusinessError'
import NetworkError from '../../../library/Error/NetworkError'

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
export default function ajax ({ url, method, headers = {}, body, ...rest }) {
  // multipart/form-data对象应对文件上传等需求
  // 不定义headers Content-Type 默认会按照application/x-www-form-urlencoded方式处理
  if (body instanceof FormData) {
    headers['Content-Type'] = 'multipart/form-data'
  }
  // 用真实参数值替换rest URI中声明参数。如products/:pid，参数是pid，最终可能会替换为products/123。
  const URIParams = (new URL(url)).pathname.match(/:[\w_]+/ig)
  if (URIParams) {
    URIParams.forEach(param => {
      const field = param.substr(1)
      const value = body[field]
      if (value !== undefined) {
        url = url.replace(param, value)
        delete body[field]
      }
    })
  } else if (method.toLowerCase() === 'get' && !headers['Content-Type']) {
    // rxjs ajax没有内置对传统方式application/x-www-form-urlencoded发送get参数的能力，这里作为补充
    url += `${url.indexOf('?') !== -1 ? '&' : '?'}${stringify(body)}`
  }

  return rxjsAjax({
    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials
    withCredentials: true,
    // responseType: 'json', // rxjs默认使用json parser
    headers: {
      'X-API-TOKEN': 'xxx',
      ...headers
    },
    url,
    method,
    body, // body instanceof FormData ? data : stringify(data),
    ...rest
  }).pipe(
    catchError(error => {
      // console.error('Low level error emit ', error)

      // 通用网络异常处理
      // todo 创建网络异常对象
      // do something with network error

      // 继续将错误抛出，允许当前stream上的其他pipe也可以捕获异常，并作自定义处理
      return throwError(new NetworkError(error))
    }),
    tap(ajaxResponse => {
      const response = ajaxResponse.response
      console.log('Low level response emit ', response)

      // 处理业务接口公共错误码，并抛出异常
      // 创建业务异常对象
      if (response.status !== 200) throw new BusinessError(response.status, response.message, response)
    }),
    catchError(error => {
      // console.error('Low level error emit ', error)

      // 通用业务异常处理
      // todo 与UI组件解耦合
      if (error instanceof BusinessError) {
        // do something with business error
      }
      // 通用网络异常处理
      if (error instanceof NetworkError) {
        // do something with network error
      }

      // 继续将错误抛出，允许当前stream上的其他pipe也可以捕获异常，提供自定义处理的机会
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
