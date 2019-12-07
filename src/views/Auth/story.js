import history from '../PluggableRouter/history'
import { onLoginSuccess, onRequestLogin } from './channel'
import { onSessionError } from '../Request/channel'
import { userRoute } from './index'

/**
 * 只要业务视图有和登录认证相关的业务，引入此文件，都能够正常响应
 * onRequestLogin、onSessionError、onLoginSuccess等事件的交互
 */

function forwardToLoginView (from = history.location) {
  const to = userRoute()
  if (!to) {
    return console.warn('You are asked to specify a route as the key should be login, e.g. ', {
      key: 'login',
      path: 'user/login',
    })
  }
  // 如果将登录事件绑定到请求上，可能会多次发送登录事件，加上是否已经在登录界面到判断
  // 如果已经在登录界面，还接收到登录事件，则可以忽略
  if (to.path !== history.location.pathname) {
    console.debug('request login, so forward to ', to.path, ' from ', from)
    history.push(to.path, { from })
  }
}
// 登录视图检测到登录事件后，执行登录视图跳转
onRequestLogin(forwardToLoginView)
// 监听会话异常
onSessionError(error => {
  console.info('token expired', error)
  forwardToLoginView()
})
// 监听登录成功通知
onLoginSuccess(from => {
  console.debug('login success, now go back to', from)
  // history.replace(from)
  history.goBack()
})
