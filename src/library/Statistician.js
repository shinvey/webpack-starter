/**
 * 发送埋点，数据统计对象
 */
export default class Statistician {
  _id;

  _label;

  /**
   * 实例化
   * @param id
   * @param label
   */
  constructor (id, label) {
    this.id(id)
    this.label(label)
  }

  /**
   * 设定事件ID
   * @param id
   * @returns {Statistician}
   */
  id (id = '') {
    this._id = id
    return this
  }

  /**
   * 设定事件label
   * @param label
   * @returns {Statistician}
   */
  label (label = '') {
    this._label = label
    return this
  }

  /**
   * 发送统计事件
   * @returns {*|Promise<any>}
   */
  send () {
    // return JsBridge.action(Statistics.send, {
    //   'id|encode': this._id,
    //   'label|encode': this._label
    // })
  }

  /**
   * 创建一个的统计事件实例
   * @param id
   * @param label
   * @returns {Statistician}
   */
  static create (id, label) {
    return new Statistician(id, label)
  }
}
