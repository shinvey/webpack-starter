/**
 * page工厂职责
 * * 检索pages or views目录下所有page.*文件为webpack创建entry
 * * 分别为所有page目录，创建该page目录下所有视图 *View/index.* 索引view-impl.js
 */

const glob = require('glob')
const fs = require('fs')
const path = require('path')
// see https://github.com/jantimon/html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')

const { isPrd } = require('./env')

// pages根目录
const pagesBasePath = './src/+(page|view)s'
const allFileExt = '.?*'
// page命名惯例，采用glob pattern
const pageFile = `page${allFileExt}`
// page下所有视图接口文件名称
const viewImpl = 'view-impl.js'
function viewImplExportCode (moduleName, modulePath) {
  // 支持 export * as namespace 语法 https://babeljs.io/docs/en/next/babel-plugin-proposal-export-namespace-from.html
  return `export * as ${moduleName} from './${modulePath}'\n`
}

/**
 * 将glob pattern的部分字符转换为regex pattern
 * @param {string} globPattern
 * @returns {string}
 */
function transformGlobPattern2Regex (globPattern) {
  return globPattern.replace(/\./g, '\\.')
    .replace(/\?\*/g, '\\w+')
    .replace(/\?/g, '\\w')
    .replace(/\*/g, '\\w*')
}
const relativeBasePathByFileRegExp = RegExp(
  `${transformGlobPattern2Regex(pagesBasePath)}/?|/?${transformGlobPattern2Regex(pageFile)}`,
  'ig'
)
function chunkName (path) {
  return path.replace(relativeBasePathByFileRegExp, '')
}

module.exports = (env, args) => {
  const entries = {}
  const arrHtmlWebpackPlugin = []

  // glob pattern https://facelessuser.github.io/wcmatch/glob/
  glob.sync(`${pagesBasePath}/**/${pageFile}`).forEach(filePath => {
    let chunk = chunkName(filePath)

    // 在每个page根目录生成该page下所有视图接口文件
    const chunkBasePath = path.dirname(filePath)
    const viewPattern = `${pagesBasePath}/${chunk ? chunk + '/' : ''}**/*View/index${allFileExt}`
    let exportCode = ''
    glob.sync(viewPattern).forEach(filePath => {
      // 得出 View 相对于 page 相对路径将作为 import 路径
      const moduleRelativePath = path.posix.relative(chunkBasePath, filePath)
      // 得出视图包名。如UserView/LoginView，会得出UserViewLoginView
      const moduleName = path.dirname(moduleRelativePath).replace(/[\\/]+/g, '')
      exportCode += viewImplExportCode(moduleName, moduleRelativePath)
    })
    fs.writeFileSync(`${chunkBasePath}/${viewImpl}`, exportCode)

    // 添加webpack entry
    chunk = chunk || 'index' // 如果不是多页应用，chunk默认为index
    entries[chunk] = filePath
    // html webpack plugin支持子目录前缀，如user/register.html
    const filename = chunk + '.html'

    // 寻找template，先在page目录中寻找*.ejs，如果找不到，逐级向父级目录查找
    /**
     * user/register/*.ejs
     * user/*.ejs
     * ./*.ejs
     */
    const _path = filePath.split('/')
    let template
    do {
      _path.pop()
      const _searchPath = _path.join('/')
      const _pattern = `${_searchPath}/*.ejs`
      const _matches = glob.sync(_pattern)
      if (_matches.length > 0) {
        template = _matches[0]
        break
      }
      // 如果搜索深度已经到达pagesPath，跳出循环
      if (pagesBasePath === _searchPath) break
    } while (_path.length > 0)
    // 没有找到模板，抛出异常
    if (!template) { throw new Error(`A template ejs file for ${filename} is required.`) }

    const htmlWebpackPluginOptions = {
      filename: filename,
      template: template,
      chunks: ['runtime', 'vendors', 'critical', chunk],
      // meta: {
      //   viewport: 'width=device-width, initial-scale=1, user-scalable=no, shrink-to-fit=no',
      //   charset: {
      //     charset: 'utf-8'
      //   }
      // },
      templateParameters: {
        args
      }
    }
    // 内嵌关键js和css。See https://www.npmjs.com/package/html-webpack-inline-source-plugin/v/1.0.0-beta.2#basic-usage
    htmlWebpackPluginOptions.inlineSource = /(runtime|critical|inline|entry).*\.(js|css)$/.source
    arrHtmlWebpackPlugin.push(new HtmlWebpackPlugin(htmlWebpackPluginOptions))
  })

  // 只在production mode采用inline，不影响web dev server调试
  if (isPrd(args.mode)) {
    arrHtmlWebpackPlugin.push(
      // The order is important - the plugin must come after HtmlWebpackPlugin.
      // see https://www.npmjs.com/package/html-webpack-inline-source-plugin/v/1.0.0-beta.2
      // 这个插件对内嵌的资源，没有执行清理，依然存在资源输出目录
      new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin)
    )
  }

  return {
    entries,
    arrHtmlWebpackPlugin
  }
}
