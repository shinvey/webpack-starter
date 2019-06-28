/**
 * 首字母大写
 * @param {String} string
 * @returns {string}
 */
export function upperFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
