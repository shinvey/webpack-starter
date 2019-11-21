import { trigger } from 'sunny-js/util/DOMEvent'
import BusinessError from './BusinessError'
import NetworkError from './NetworkError'
// import { handleSessionError } from '../Auth/errorHandler'

/**
 * 请求异常处理分三个生命周期方法，分别是
 * beforeCatchError
 * detectErrorFromResponse
 * afterCatchError
 */

/**
 * 第一个捕获异常的钩子方法
 * 可以用来创建业务异常或网络异常
 * @param error
 * @returns {*|BusinessError|NetworkError}
 */
export function beforeCatchError (error) {
  // console.error('Low level error emit ', error)

  // 通用网络异常处理
  const response = error.response
  return response ? new BusinessError(response.status, response.msg, response) : new NetworkError(error)
}

/**
 * 第一个检测异常的钩子方法
 * 可以在后端接口正常返回时，探测是否为异常业务代码，从而决定是否创建BusinessError
 * @param {object} response
 * @returns {BusinessError|undefined}
 */
export function detectErrorFromResponse (response) {
  // 处理业务接口公共错误码，并抛出异常
  // 创建业务异常对象
  if (response.status !== BusinessError.DONE) {
    return new BusinessError(response.status, response.message, response)
  }
}

/**
 * 第三个捕获异常的钩子方法
 * 在经过前面两个创建异常方法的铺垫后，这个方法用来调用异常处理逻辑
 * @param error
 * @returns {*} 需要返回error实例
 */
export function afterCatchError (error) {
  // console.error('Low level error emit ', error)

  // handleSessionError(error)

  /**
   * 通用异常处理
   * 通过document根结点抛出异常事件，由外部对事件感兴趣对相关逻辑处理
   */
  trigger(error.constructor.name, error)
}
