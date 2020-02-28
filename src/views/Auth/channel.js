import { ReplaySubject } from 'rxjs'
import { createAction, on } from 'sunny-js/util/Channel'
export * from 'sunny-js/util/Channel'

/**
 * 创建一个用于处理认证事件的广播
 * 使用ReplaySubject创建频道，bufferSize 1 表示总是可以让新的订阅者收到最后一个事件
 *
 * 使用ReplaySubject创建频道，可以让订阅者相关逻辑懒加载。
 * 表示订阅者可以在事件发生后订阅频道并能够收到最后一个事件
 */
const authChannel = new ReplaySubject(1)

export function sendAction (action) {
  return authChannel.next(action)
}

// 登录 事件
export const LOGIN = 'LOGIN'
export function createLoginAction (payload) {
  return createAction(LOGIN, payload)
}

// 登录成功 事件
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export function createLoginSuccessAction (payload) {
  return createAction(LOGIN_SUCCESS, payload)
}

/**
 * 监听登录成功事件
 * 该方法如果不注销unsubscribe，会常驻内存，持续监听
 * @param {function} callback 收到登录成功的事件后会调用callback
 * @param {string} [key] 可选，在使用Function.prototype.bind绑定的函数，要求传入
 * @returns {Subscription}
 * @example
 * // 开始监听
 * const subscription = onLoginSuccess((payload) => {})
 * // 注销监听
 * subscription.unsubscribe()
 */
export function onLoginSuccess (callback, key) {
  return on(authChannel, LOGIN_SUCCESS, callback, key)
}

/**
 * 发送登录成功事件
 * @param from
 */
export function loginSuccess (from) {
  return sendAction(createLoginSuccessAction(from))
}

/**
 * 监听请求登录事件
 * 该方法如果不注销unsubscribe，会常驻内存，持续监听
 * @param {function} callback 收到请求登录的事件后会调用callback
 * @param {string} [key] 可选，在使用Function.prototype.bind绑定的函数，要求传入
 * @returns {Subscription}
 * @example
 * // 开始监听
 * const subscription = onRequestLogin((payload) => {})
 * // 注销监听
 * subscription.unsubscribe()
 */
export function onRequestLogin (callback, key) {
  return on(authChannel, LOGIN, callback, key)
}

export function requestLogin (payload) {
  return sendAction(createLoginAction(payload))
}

// 无权访问 事件
export const BLOCK_VISITOR = 'BLOCK_VISITOR'
export function blockVisitor () {
  return sendAction(createAction(BLOCK_VISITOR))
}
// 监听 当用户被阻止访问时的 事件
export function onBlocked (callback, key) {
  return on(authChannel, BLOCK_VISITOR, callback, key)
}

export default authChannel
