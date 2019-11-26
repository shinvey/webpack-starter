import createChannel from 'sunny-js/util/Channel'
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
 * @returns {Subscription}
 * @example
 * // 开始监听
 * const subscription = onSessionError((payload) => {})
 * // 注销监听
 * subscription.unsubscribe()
 */
export function onSessionError (callback) {
  const subscription$ = onSessionError.subscription$
  // 热更新场景下，需要避免重复绑定
  if (module.hot && subscription$) subscription$.unsubscribe()
  return onSessionError.subscription$ = requestChannel.subscribe(({ payload: error }) => {
    error.code === BusinessError.TOKEN_EXPIRED && callback(error)
  })
}

export default requestChannel
