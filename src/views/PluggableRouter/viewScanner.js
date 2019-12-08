/**
 * 视图扫描
 * @param {object} config
 * @param {function} config.iteratee
 * @returns {Array}
 */
export default ({ iteratee }) => {
  // webpack require.context api https://github.com/webpack/docs/wiki/context
  // require.context的参数只能够接受直接书写的方式，不可使用变量
  const req = require.context('../', true, /\w+View\/index\.[a-z]+$/i)
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
 */
export function modulePathToDirPath (path) {
  const regexp = /^([./]*)([\w\d-/_]+?)\/index\.[\w]+$/ig
  path = path.replace(/view/ig, '')
  return path.replace(regexp, '$2') // .toLowerCase()
}
