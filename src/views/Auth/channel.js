import { Subject } from 'rxjs'
/**
 * 创建一个用于处理认证事件的广播
 */
const authChannel = new Subject()
// 登录 事件
export const LOGIN = 'LOGIN'
// 登录成功 事件
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'

export function createAction (type, payload) {
  return {
    type,
    payload
  }
}

export function sendAction (action) {
  return authChannel.next(action)
}

export function createLoginAction (payload) {
  return createAction(LOGIN, payload)
}

export function createLoginSuccessAction (payload) {
  return createAction(LOGIN_SUCCESS, payload)
}

/**
 * 监听登录成功事件
 * 该方法如果不注销unsubscribe，会常驻内存，持续监听
 * @param callback 收到登录成功的事件后会调用callback
 * @returns {Subscription}
 * @example
 * // 开始监听
 * const subscription = onLoginSuccess((payload) => {})
 * // 注销监听
 * subscription.unsubscribe()
 */
export function onLoginSuccess (callback) {
  // 监听登录成功通知
  return authChannel.subscribe(({ type, payload }) => {
    type === LOGIN_SUCCESS && callback(payload)
  })
}

/**
 * 监听请求登录事件
 * 该方法如果不注销unsubscribe，会常驻内存，持续监听
 * @param callback 收到请求登录的事件后会调用callback
 * @returns {Subscription}
 * @example
 * // 开始监听
 * const subscription = onRequestLogin((payload) => {})
 * // 注销监听
 * subscription.unsubscribe()
 */
export function onRequestLogin (callback) {
  return authChannel.subscribe(({ type, payload }) => {
    type === LOGIN && callback(payload)
  })
}

export default authChannel
