/**
 * @typedef {NodeRequire} require
 * @property {Function} context [webpack require.context](https://webpack.js.org/guides/dependency-management/#requirecontext)
 */

/**
 * 视图扫描
 * @param {function} iteratee
 * @returns {Array}
 */
export default (iteratee) => {
  /**
   * webpack require.context api https://github.com/webpack/docs/wiki/context
   * require.context的参数只能够接受直接书写的方式，不可使用变量
   * 匹配两种模式的module path
   * - pathView/index
   * - path/route
   */
  const req = require.context('../', true, /(\w+View\/index|\/route)\.[a-z]+$/i)
  const contents = []
  req.keys().forEach((modulePath, index) => {
    const result = iteratee(req(modulePath), modulePath, index)
    result && contents.push(result, modulePath)
  })
  return contents
}

/**
 * 将Module Path转换成不包含文件名的目录路径
 * @param path
 * @returns {string} directory path
 * @example
 * modulePathToDirPath('User/LoginView/index.jsx')
 * // => "User/Login"
 * modulePathToDirPath('User/Login/route.jsx')
 * // => "User/Login"
 */
export function modulePathToDirPath (path) {
  const regexp = /^([./]*)([\w\d-/_]+?)\/(index|route)\.[\w]+$/ig
  path = path.replace(/view/ig, '')
  return path.replace(regexp, '$2') // .toLowerCase()
}
