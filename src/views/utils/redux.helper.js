export const actionCreator = (type, payload) => ({
  type,
  payload,
})

/**
 * 返回一个可以被redux bindActionCreators直接包装的函数
 * @param {string} type
 * @returns {function(payload): {payload: *, type: string}}
 */
export const actionCreatorFn = type => payload => actionCreator(type, payload)
