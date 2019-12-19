/**
 * 将一个action翻译成另一个action
 * 在redux中，给reducer的action执行翻译逻辑
 * 该函数是一个高阶函数
 * @param {object} translator
 * @returns {function}
 * @see https://stackblitz.com/edit/redux-action-translator
 */
export const mapToNewAction = (translator) =>
  (target) =>
    (state, action, ...args) =>
      target(state, translator[action.type](action), ...args)

/**
 * 存放action translator逻辑的对象
 * @type {object}
 */
const _translator = {}

/**
 * 添加action翻译逻辑
 * @param {string} actionType should be action.type
 * @param {function} translate logic to translate action
 * @returns {Object}
 */
export function addActionTranslator (actionType, translate) {
  _translator[actionType] = translate
  return _translator
}

/**
 * 状态同步中间件
 * @param {object} store redux store
 * @returns {object} return modified state
 */
export const syncMiddleware = store => next => action => {
  // 首先直接保持dispatch的默认行为，就是先发送当前的action，给所有reducer处理
  const result = next(action)

  /**
   * 通过action translator的转换，
   * 然后发送翻译后的action，
   * 如此就可以在两个应用公用一个store的情况下实现状态同步
   */
  // 取出action翻译函数
  const translate = _translator[action.type]
  if (typeof translate === 'function') {
    // 发送翻译后的action
    next(translate(action))
  }

  return result
}

/**
 * 将syncMiddleware以Redux Dynamic Module库的Extension形式创建
 */
export function syncStateExtension () {
  return {
    middleware: [syncMiddleware],
  }
}
