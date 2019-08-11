import stringify from 'qs/lib/stringify'
import { ajax as rxjsAjax } from 'rxjs/ajax'
import { tap, catchError } from 'rxjs/operators'
import ajaxSetup from './ajaxSetup'

/**
 * 处理请求底层公用逻辑
 * 1. 携带token
 * 2. 处理公共接口错误码
 * 3. 公共异常处理
 *
 * 业务逻辑层只处理私有异常和正常相应数据
 * @param {Object} settings
 * @returns {Observable<any>}
 */
export default function ajax (settings) {
  let { url, method, headers = {}, body, ...rest } = ajaxSetup(settings)
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
    // withCredentials: true,
    // responseType: 'json', // rxjs默认使用json parser
    headers,
    url,
    method,
    body, // body instanceof FormData ? data : stringify(data),
    ...rest
  }).pipe(
    catchError(rest.beforeCatchError),
    tap(rest.tap),
    catchError(rest.afterCatchError)
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
/**
 * ajax PUT 快捷方法
 * @example
 * put('http://example', { field: 'value' }).subscribe(ajaxResponse => {})
 */
export function put (/* url, body, options */ ...args) {
  return shorthandMethod(ajax, 'PUT', ...args)
}
/**
 * ajax PATCH 快捷方法
 * @example
 * patch('http://example', { field: 'value' }).subscribe(ajaxResponse => {})
 */
export function patch (/* url, body, options */ ...args) {
  return shorthandMethod(ajax, 'PATCH', ...args)
}
/**
 * ajax DELETE 快捷方法
 * @example
 * del('http://example', { field: 'value' }).subscribe(ajaxResponse => {})
 */
export function del (/* url, body, options */ ...args) {
  return shorthandMethod(ajax, 'DELETE', ...args)
}
