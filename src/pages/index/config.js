import { config } from '../../components/biz/config'

/**
 * 私有视图config配置
 */
const myConf = {
  local: {
  },
  development: {
  },
  staging: {
  },
  production: {
  }
}

/**
 * Web Service API
 * @param {String} api api接口的名称
 */
export default config.combine(myConf).api

export const myConfig = config
