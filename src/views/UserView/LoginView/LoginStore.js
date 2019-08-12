import { observable, action } from 'mobx'

/**
 * __领域状态（Domain Store）职责__
 * 建议：
 * * 领域状态对象应只负责独立的领域问题。例如当前状态对象只负责登录相关问题，不负责注册业务
 * * 状态对象默认以局部状态方式管理，对象实例随着组件被销毁后，进而能够被浏览器回收
 * * UI状态声明 @observable
 * * 修改状态方法声明 @action
 * * 不推荐声明其他方法处理同步/异步任务，会引入依赖关系问题，增加initial bundle的大小
 * * 将同步或异步任务从store中分离出去
 *
 * 可选：
 * * 如果状态需要长期存储在内存中，请使用单例模式来访问状态对象
 * * 声明其他私有属性或逻辑状态
 */

export default class LoginStore {
  @observable isLogin = false

  /**
   * @readonly
   * @type {undefined|String}
   */
  token = undefined

  /**
   * @type {string}
   * @private
   */
  _tokenKey = 'token'

  constructor () {
    const token = localStorage.getItem(this._tokenKey)
    token ? this.login(token) : this.logout()
  }

  /**
   * 这是登录相关状态
   * @param {String} token
   */
  @action
  login (token) {
    // 登录
    this.isLogin = true
    this.token = token
    localStorage.setItem(this._tokenKey, token)
  }

  @action
  logout () {
    this.isLogin = false
    this.token = undefined
    localStorage.removeItem(this._tokenKey)
  }

  /**
   * You should not directly access this static property
   * @type LoginStore
   */
  static _instance

  /**
   * 用单例模式使用类
   * @returns {LoginStore}
   */
  static Singleton () {
    this._instance = this._instance || new LoginStore()
    return this._instance
  }
}
