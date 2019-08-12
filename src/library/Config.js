import { merge, defaults, propBy } from './utils/index'

/**
 * 配置对象
 * @example
 * config = new Config({
 *   none: {
      schema: 'http',
      host: '',
      port: 80,
      basePath: '',
      api: {
        example: 'restful/api'
      }
    },
    // 对象结构与none一致，由section方法进行切换
    local: {
      host: 'localhost',
      api: {
        example2: 'restful/api2'
      }
    },
 * })
 * config.section('local')
 * config.api('example2')
 * //=> http://localhost/restful/api2
 */
export default class Config {
  /**
   * @private
   * @type {Object}
   */
  _conf = {
    none: {
      schema: 'http',
      host: '',
      port: 80,
      basePath: '',
      api: {}
    },
    local: {},
    development: {},
    staging: {},
    production: {}
  };

  _sections = [];

  /**
   * @param {Object} conf
   */
  constructor (conf) {
    this._combine(true, conf)
  }

  /**
   * 添加新的配置对象
   * @param args
   * @returns {Config}
   */
  combine (...args) {
    return this._combine(false, ...args)
  }

  /**
   * 合并新的配置对象
   * @param replace 是否以替换方式的合并。如果为否，则已经定义的属性为只读模式，不可修改
   * @param args
   * @returns {Config}
   * @private
   */
  _combine (replace, ...args) {
    (replace ? merge : defaults)(this._conf, ...args)
    this._sections = Object.keys(this._conf)
    return this
  }

  /**
   * 当前section等级
   * @type {number}
   */
  level = 0

  env = 'none'

  /**
   * section转level
   * 这里排序是受原生Object key值排序规则影响的
   * @param section
   * @returns {number}
   */
  toLevel (section) {
    return this._sections.indexOf(section)
  }

  /**
   * section是各个环境的抽象名称代指当前环境配置
   * @private
   * @type {Object}
   */
  _section = {};

  /**
   * 返回当前env环境的config
   * @param {String} env 要切换的配置段
   * @param {String} [mode] 默认扁平化合并方式，和none配置合并；如果是inherit则是继承模式，右下往上合并配置
   * @returns {Config}
   */
  section (env, mode) {
    this.env = env
    if (mode === 'inherit') {
      this._sections.some((section, key) => {
        merge(this._section, this._conf[section])
        this.level = key
        return env === section
      })
    } else {
      // 扁平化合并方式，这把目标环境配置和第一个配置段合并
      merge(this._section, this._conf[this._sections[this.level]], this._conf[env])
      // 切换后的section level
      this.level = this.toLevel(env)
    }
    return this
  }

  get (name) {
    return this._section[name]
  }

  baseURL () {
    const {
      schema, host, port, basePath
    } = this._section
    return `${schema}://${host}:${port}/${basePath}`
  }

  /**
   * 读取web service api
   * @param api
   * @returns {string}
   */
  api = api => `${this.baseURL()}/${propBy(api, this._section.api)}`

  /**
   * @alias Config.api
   */
  url = this.api;

  /**
   * @type Config
   */
  static _instance

  /**
   * 用单例模式使用类
   * @param args
   * @returns {Config}
   */
  static Singleton (...args) {
    this._instance = this._instance || new Config(...args)
    return this._instance
  }
}
