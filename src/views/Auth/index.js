import store from '../Container/store'
// import { store } from '../../index'
import { useRoutes } from '../PluggableRouter'
import { propBy } from 'sunny-js/util/object'
import './story'

/**
 * token获取接口
 * @returns {string}
 */
export function token () {
  // console.debug('store state', store.getState());
  return userInfo().token
}

/**
 * 判断是否登录
 * @returns {boolean}
 */
export function isLogin () {
  return !!token()
}

/**
 * 用户信息对象
 * @typedef {object} UserInfo
 * @property {string} [token] 用户token
 * @property {string} [role] 用户角色
 */

/**
 * 为js纯函数提供userInfo信息访问接口
 * @returns {UserInfo}
 */
export function userInfo () {
  return propBy('user', store.getState()) || {}
}

export function userRoute () {
  // 旧应用的登录视图url
  // return {
  //   key: 'login',
  //   path: '/login',
  // }
  return useRoutes('login')
}
