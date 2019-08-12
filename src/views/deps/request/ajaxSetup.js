import { throwError } from 'rxjs'
import BusinessError from '@/library/Error/businessError'
import NetworkError from '@/library/Error/networkError'
import WEB_SERVICE_CODE from '../WEB_SERVICE_CODE'
import LoginStore from '@/views/UserView/LoginView/LoginStore'

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
    headers: {
      'X-API-TOKEN': LoginStore.Singleton().token,
      ...headers
    },
    beforeCatchError (error) {
      // console.error('Low level error emit ', error)

      // 通用网络异常处理
      // todo 创建网络异常对象
      // do something with network error

      // 继续将错误抛出，允许当前stream上的其他pipe也可以捕获异常，并作自定义处理
      const response = error.response
      return throwError(response ? new BusinessError(response.status, response.msg, response) : new NetworkError(error))
    },
    tap: {
      next (ajaxResponse) {
        const response = ajaxResponse.response
        console.log('Low level response emit ', response)

        // 处理业务接口公共错误码，并抛出异常
        // 创建业务异常对象
        if (response.status !== WEB_SERVICE_CODE.DONE) throw new BusinessError(response.status, response.message, response)
      }
    },
    afterCatchError (error) {
      // console.error('Low level error emit ', error)

      // 通用业务异常处理
      // todo 与UI组件解耦合
      if (error instanceof BusinessError) {
        // do something with business error
        // 如果业务代码为用户会话超时
        switch (true) {
          case error.code === WEB_SERVICE_CODE.TOKEN_EXPIRED:
            LoginStore.Singleton().logout()
            break
        }
      }
      // 通用网络异常处理
      if (error instanceof NetworkError) {
        // do something with network error
      }

      // 继续将错误抛出，允许当前stream上的其他pipe也可以捕获异常，提供自定义处理的机会
      return throwError(error)
    },
    ...rest
  }
}
