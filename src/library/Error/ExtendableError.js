export default class ExtendableError {
  code;

  message;

  stack;

  constructor (message) {
    this.message = message
    // this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = (new Error(message)).stack
    }
  }
}
