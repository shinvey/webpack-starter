/**
 * 数组求和
 * @param {Number[]} array
 * @returns {Number}
 */
export function sum (array) {
  return array.reduce((previous, current) => previous + current)
}

/**
 * 返回百分比
 * @param {Number|String} numerator 分子
 * @param {Number|String} denominator 分母
 * @param {Number} fixedPoint 小数位精度
 * @returns {string}
 */
export function percent (numerator = 0, denominator, fixedPoint = 0) {
  const _numerator = parseFloat(numerator)
  const _denominator = parseFloat(denominator)
  return `${_denominator > 0 ? (_numerator / _denominator * 100).toFixed(fixedPoint) : 0}%`
}

/**
 * 是否为数字
 * @param input
 * @return {boolean}
 */
export function isNum (input) {
  return !Number.isNaN(parseFloat(input))
}
