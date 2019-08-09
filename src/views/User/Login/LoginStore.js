import { observable, action } from 'mobx'
import { login } from './service'

/**
 * __领域状态（Domain Store）职责__
 * 建议：
 * * 领域状态对象应只负责独立的领域问题。例如当前状态对象只负责登录相关问题，不负责注册业务
 * * 状态对象默认以局部状态方式管理，对象实例随着组件被销毁后，进而能够被浏览器回收
 * * UI状态声明 @observable
 * * 修改状态方法声明 @action
 *
 * 可选：
 * * 如果状态需要长期存储在内存中，请使用单例模式来访问状态对象
 * * 声明其他私有属性或逻辑状态
 * * 声明其他私有方法处理同步/异步任务
 */

export default class LoginStore {
  @observable isLogin = false

  @action
  login (params) {
    // 登录
    return login(params).then(() => this.isLogin = true)
  }

  @action
  signOut () {
    return Promise.resolve().then(() => this.isLogin = false)
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
