import { get, post } from '../../deps/request/ajaxPromise'
import api from './config'

/**
 * __服务层职责说明__
 * 建议：
 * * 管理rest api请求
 * * 组合接口数据
 *
 * 可选：
 * * 整理数据结构
 * * 分离整理数据结构的逻辑为独立函数
 */

// 用户登录接口
export function login (params) {
  return post(api('user.login'), params)
}
// 用户退出接口
export function logout () {
  return get(api('user.logout'))
}
