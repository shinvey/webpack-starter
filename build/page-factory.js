const glob = require('glob')
// see https://github.com/jantimon/html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')

const { isPrd } = require('./env')
// pages根目录
const pagesBasePath = './src/pages'
// page命名惯例
const pageFile = 'page.js'

module.exports = (env, args) => {
  const entries = {}
  const arrHtmlWebpackPlugin = []

  glob.sync(`${pagesBasePath}/**/${pageFile}`).forEach(path => {
    const chunk = path.replace(RegExp(`${pagesBasePath}/?|/?${pageFile}`, 'ig'), '')

    // 添加webpack entry
    entries[chunk] = path

    // html webpack plugin支持子目录前缀，如user/register.html
    const filename = chunk + '.html'

    // 寻找template，先在page目录中寻找*.ejs，如果找不到，逐级向父级目录查找
    /**
     * user/register/*.ejs
     * user/*.ejs
     * ./*.ejs
     */
    let _path = path.split('/')
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

    let htmlWebpackPluginOptions = {
      filename: filename,
      template: template,
      meta: {
        viewport: 'width=device-width, initial-scale=1, user-scalable=no, shrink-to-fit=no',
        charset: {
          charset: 'utf-8'
        }
      },
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
