import { config } from '../../deps/config'

/**
 * 私有视图config配置
 * __职责说明__
 * 建议
 * * 只声明和当前视图有关的接口
 * * 只声明和当前有关其他配置信息
 * * 配置对象的叶子节点属性避免重名，重名的属性会被丢弃
 * 可选
 * * 暂无
 */
const conf = {
  none: {
    api: {
      user: {
        // rest URI中携带参数方式
        // login: 'v1/user/login/:id/:password'
        // 普通方式form提交方式
        login: 'v1/user/login',
        logout: 'v1/user/logout'
      }
    }
  }
}

/**
 * Web Service API
 * @param {String} api api接口的名称
 */
export default config.combine(conf).section(env.SVC_ENV).api

export { config }
