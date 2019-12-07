import createChannel, { on } from 'sunny-js/util/Channel'
import BusinessError from './BusinessError'
export * from 'sunny-js/util/Channel'

/**
 * 创建一个公用频道
 * @example
 * // 订阅频道
 * const subscription = channel.subscribe(action => {})
 * // 给频道发送一个广播
 * channel.next(createAction('custoEvent', payload))
 * // 取消订阅
 * subscription.unsubscribe()
 */
const requestChannel = createChannel()

/**
 * 监听会话超时异常
 * 该方法如果不注销unsubscribe，会常驻内存，持续监听
 * @param callback 收到请求登录的事件后会调用callback
 * @param {string} [key] 可选，在使用Function.prototype.bind绑定的函数，要求传入
 * @returns {Subscription}
 * @example
 * // 开始监听
 * const subscription = onSessionError((payload) => {})
 * // 注销监听
 * subscription.unsubscribe()
 */
export function onSessionError (callback, key) {
  return on(
    requestChannel,
    BusinessError.name,
    error => {
      error.code === BusinessError.TOKEN_EXPIRED && callback(error)
    },
    key || callback.toString(),
  )
}

export default requestChannel
