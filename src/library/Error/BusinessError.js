import ExtendableError from './ExtendableError'

export default class BusinessError extends ExtendableError {
  response;

  /**
   * @param {Number} code 接口状态码
   * @param {String} message 接口状态消息
   * @param {Object} response 接口响应数据
   */
  constructor (code, message, response) {
    super(message || 'Business Error')

    this.code = code
    this.response = response
  }
}
