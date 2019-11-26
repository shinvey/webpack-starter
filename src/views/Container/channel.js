import createChannel from 'sunny-js/util/Channel'
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
const channel = createChannel()

export default channel
