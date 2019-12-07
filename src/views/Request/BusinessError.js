import BusinessError from 'sunny-js/request/BusinessError'
/**
 * 公用业务代码字典
 * 如果是子视图组件的私有业务代码不建议写在这里，你可以自行在视图目录中创建私有业务代码字典
 */
BusinessError.TOKEN_EXPIRED = 6001
BusinessError.TOKEN_EXPIRED_MSG = '会话超时'
BusinessError.DONE = 6000
BusinessError.SECURITY_RISK = 6016

export default BusinessError
