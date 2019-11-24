import store from '../store'

// 登录 事件
export const LOGIN = 'LOGIN'
// 登录成功 事件
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'

/**
 * token获取接口
 * @returns {string}
 */
export function token () {
  return store.getState().user.token || 'adfasdfopwekljladjfpafasdfasd'
}

/**
 * 判断是否登录
 * @returns {boolean}
 */
export function isLogin () {
  return !!token()
}
