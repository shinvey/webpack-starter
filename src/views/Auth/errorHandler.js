// import BusinessError from '../Request/BusinessError'
// import { login } from './index'

/**
 * 处理会话相关异常
 * 不建议在此处理本该视图层处理的交互问题，比如跳转、弹窗等
 * 建议只修改会话相关的共享状态，具体交互行为由视图层某个公共组件来做
 * @param {BusinessError} error
 */
// export function handleSessionError(error) {
//   // 如果业务代码为用户会话超时
//   if (error.code === BusinessError.TOKEN_EXPIRED) {
//     // do something with business error
//     login()
//   }
// }
