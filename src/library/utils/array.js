/**
 * 是否在数组中
 * @param {Array} arr
 * @param {*} term
 * @returns {Boolean}
 */
export function inArray (arr, term) {
  return arr.some(val => val === term)
}
