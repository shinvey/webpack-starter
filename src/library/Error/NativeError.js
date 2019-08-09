import ExtendableError from './ExtendableError'

export default class NativeError extends ExtendableError {
  data;

  /**
   * @param {Number} code Native接口状态码
   * @param {String} message Native接口消息
   * @param {*} data Native接口数据
   */
  constructor (code, message, data) {
    super(message || 'Native Error')

    this.code = code
    this.data = data
  }
}
