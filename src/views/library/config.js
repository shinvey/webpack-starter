import Config from '../../library/Config'

/**
 * 公用配置
 * Config默认以扁平化方式合并配置信息。例如将development跟none合并，切换到staging时，将staging与none
 */
const myConf = {
  none: {
    basePath: 'ft/admin',
    api: {
      // 公用接口配置信息
    }
  },
  local: {
    host: 'localhost'
  },
  development: {
    host: 'ftadmin.fulltime.ws',
    port: 10000
  },
  staging: {
    host: 'ftadmin.fulltime.ws',
    port: 10000
  },
  production: {
    schema: 'https',
    port: 443
  }
}

/**
 * 采用单例模式
 * @type {Config}
 */
export const config = new Config(myConf)

/**
 * Web Service API
 * @param {String} api api接口的名称
 * @example
 * api('name')
 */
export default config.section(env.SVC_ENV).api
