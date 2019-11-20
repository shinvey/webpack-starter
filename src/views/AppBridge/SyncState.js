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
  // 首先直接保持dispatch的默认行为
  let result = next(action)

  /**
   * 通过action translator，dispatch翻译后的action，就可以在两个应用公用一个store
   * 的情况下实现状态同步
   */
  const translate = _translator[action.type]
  if (typeof translate === 'function') {
    // 先调用dispatch输出的结果，如果命名冲突的情况下，优先保留结果
    result = Object.assign(next(translate(action) || action), result)
  }

  return result
}
