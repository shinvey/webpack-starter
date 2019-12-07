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
 * 将Module Path转换成Router Path
 * @param path
 * @returns {string}
 */
export function routerPath (path) {
  return path.replace(routerPath.regexp, '$2').toLowerCase()
}
routerPath.regexp = /^([./]*)([\w\d-/_]+?)view\/index\.[\w]+$/ig
