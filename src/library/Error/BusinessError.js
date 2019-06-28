import ExtendableError from 'assets/lib/Error/ExtendableError'

export default class BusinessError extends ExtendableError {
  response;

  /**
   * @param {Object} res 接口响应数据
   * @param params
   */
  constructor (res = {}, ...params) {
    params.unshift(res.message || 'Business Error')
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params)

    this.code = res.state
    this.response = res
  }
}
