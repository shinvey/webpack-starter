import { throwError } from 'rxjs'
import { token } from '../Auth'
import { beforeCatchError, afterCatchError, detectErrorFromResponse } from './errorHandler'

/**
 * 配置底层的ajax行为
 * @param url
 * @param method
 * @param headers
 * @param body
 * @param rest
 * @returns {{headers: {'X-API-TOKEN': *}, beforeCatchError(*=): *, tap: {next(*): void}, method: *, afterCatchError(*=): *, body: *, url: *}|Observable<never>}
 */
export default function ajaxSetup ({ url, method, headers = {}, body, ...rest }) {
  // 设定业务接口默认传递参数的类型
  if (method.toLowerCase() !== 'get') {
    headers['Content-Type'] = 'application/json'
  }
  return {
    url,
    method,
    body,
    // 设定自定义http header
    headers: {
      'X-API-TOKEN': token(),
      ...headers
    },
    // 继续将错误抛出，允许当前stream上的其他pipe也可以捕获异常，并作自定义处理
    beforeCatchError: error => throwError(beforeCatchError(error) || error),
    tap: {
      next (ajaxResponse) {
        const response = ajaxResponse.response
        console.log('Low level response emit ', response)

        const error = detectErrorFromResponse(response)
        if (error) {
          throw error
        }
      }
    },
    // 继续将错误抛出，允许当前stream上的其他pipe也可以捕获异常，提供自定义处理的机会
    afterCatchError: error => throwError(afterCatchError(error) || error),
    ...rest
  }
}
