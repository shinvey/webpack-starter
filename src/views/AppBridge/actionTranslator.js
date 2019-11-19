/**
 * 在redux中，给reducer的action执行翻译
 * 该函数是一个高阶函数
 * @param {object} mapTranslator
 * @returns {function}
 * @see https://stackblitz.com/edit/redux-action-translator
 */
export default (mapTranslator) =>
  (target) =>
    (state, action, ...args) =>
      target(state, mapTranslator[action.type](action), ...args)
