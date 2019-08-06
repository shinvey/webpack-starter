import Config from '../../library/Config'

/**
 * 公用配置
 */
const myConf = {
  none: {
    basePath: 'version/path/to/',
    api: {
      // 普通资金号资产接口
      RESTful: 'api'
    }
  },
  local: {
    host: 'localhost'
  },
  development: {
  },
  staging: {
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
