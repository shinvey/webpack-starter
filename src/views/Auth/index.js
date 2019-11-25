import store from '../Container/store'

/**
 * token获取接口
 * @returns {string}
 */
export function token () {
  return store.getState().user.token
}

/**
 * 判断是否登录
 * @returns {boolean}
 */
export function isLogin () {
  return !!token()
}
