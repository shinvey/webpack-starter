import { login as _login } from './service'
import LoginStore from './LoginStore'

/**
 * __业务（Business）职责__
 * 建议：
 * * 是管理业务逻辑，它们可以是某个同步任务，或异步任务
 * * 避免在当前export外声明变量存储占用内存较大的对象
 * * 引用使用完后应该销毁
 *
 * 可选：
 * * 可以对业务进行抽象以面向对象编程方式进行管理
 * * 也可以函数式编程方式管理业务逻辑
 * * 如果有必要，可以import UI状态类
 */

export default class LoginBiz {
  /**
   * @type {LoginStore}
   */
  store = LoginStore.Singleton()

  login (params) {
    // 登录
    return _login(params).then(() => this.store.isLogin = true)
  }

  signOut () {
    return Promise.resolve().then(() => this.store.isLogin = false)
  }
}
