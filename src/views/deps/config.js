import Config from '../../library/Config'

/**
 * 公用配置
 */
const myConf = {
  none: {
    // basePath: '/base/path/',
    // api: {
    //   RESTful: 'api'
    // }
  },
  local: {
    host: 'localhost'
  },
  development: {
    host: 'rap2api.taobao.org',
    basePath: 'app/mock/227707'
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
