import store from '../Container/store'
import { routes } from '../PluggableRouter'

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

export function userRoute () {
  return routes.login
}
