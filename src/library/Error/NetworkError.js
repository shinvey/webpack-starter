/* eslint-disable no-param-reassign */
import ExtendableError from './ExtendableError'

export default class NetworkError extends ExtendableError {
  context;

  constructor (context = {}) {
    super(NetworkError.EnhanceMessage(context.message))

    this.code = context.status
    this.context = context
  }

  static EnhanceMessage (message) {
    if (!message) {
      return message
    }

    /**
     * 'Network Error'
     'timeout of ' + config.timeout + 'ms exceeded'
     'maxContentLength size of ' + config.maxContentLength + ' exceeded'
     'timeout of ' + config.timeout + 'ms exceeded'
     'Request failed with status code '
     'Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream'
     */
    const _matches = message.match(/^(\w+)/i)
    const _match = (_matches[1] || '').toLowerCase()
    // this.code = this.code || _match
    // todo 将网络错误的message抽离出来做成可以被外部修改的配置
    switch (_match) {
      case 'network': // 服务器无法连接
        message = '网络异常，请检查后再试'
        break
      case 'timeout': // 网络连接超时
        message = '网络异常，请检查后再试'
        break
      case 'maxcontentlength':
        message = '服务器的响应内容（response body）超出内容大小限制'
        break
      case 'request': // 请求失败
        message = '系统繁忙，请稍后再试'
        break
      case 'data':
        message = '服务器的响应内容（response body）无法解析'
        break
      default:
        break
    }

    return message
  }
}
