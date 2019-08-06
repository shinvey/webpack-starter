/**
 * 用户账户管理
 * 它既是一个状态容器，也是提供登录和退出登录方法
 */
export default {
  isAuthenticated: false,
  authenticate () {
    return new Promise((resolve, reject) => {
      this.isAuthenticated = true
      setTimeout(resolve, 100) // fake async
    })
  },
  signOut () {
    return new Promise((resolve, reject) => {
      this.isAuthenticated = false
      setTimeout(resolve, 100) // fake async
    })
  }
}
