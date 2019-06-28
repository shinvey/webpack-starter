import ExtendableError from './ExtendableError'

export default class NativeError extends ExtendableError {
  data;
  method;
  constructor (res = {}, ...params) {
    params.unshift(res.errorMessage || 'Native Error')

    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params)

    this.code = res.errorCode
    this.method = res.method
    this.data = res
  }
}
