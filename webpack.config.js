/**
 * webpack configuration exports a function
 * Environment Variables see https://webpack.js.org/guides/environment-variables
 * @param env 为args.env， see https://webpack.js.org/api/cli/#environment-options
 * @param args 命令行参数列表
 * @returns Object
 */
module.exports = (env, args) => {
  const path = require('path')
  const cssPreprocessor = require('./build/css-processor')(env, args)

  // 将被loader处理的源码目录白名单
  const directoryWhiteList = [
    path.resolve(__dirname, 'src')
  ]

  /**
   * 样式文件处理
   */
  const styleLoader = cssPreprocessor.styleLoader()
  const postcssLoader = cssPreprocessor.postcssLoader()
  // css or pcss
  const cssPreprocessors = [
    styleLoader,
    cssPreprocessor.cssLoader({
      importLoaders: 1
    }),
    postcssLoader
  ]
  // sass or scss
  const sassPreprocessors = [
    styleLoader,
    cssPreprocessor.cssLoader({
      importLoaders: 2
      // modules: true
    }),
    postcssLoader,
    cssPreprocessor.sassLoader()
  ]

  // 插件管理
  const plugins = []

  // 处理HTML
  const HtmlWebpackPlugin = require('html-webpack-plugin')
  plugins.push(
    new HtmlWebpackPlugin({
      template: './src/pages/home/index.html'
    })
  )

  // 抽离css https://github.com/webpack-contrib/mini-css-extract-plugin
  const MiniCssExtractPlugin = require('mini-css-extract-plugin')
  plugins.push(
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  )
  // 替换style loader就可以抽离css文件了
  styleLoader.loader = MiniCssExtractPlugin.loader

  // souce map配置
  // todo 解决production输出source map路径不对问题
  // if (args.devtool) {
  //   const webpack = require('webpack')
  //   plugins.push(new webpack.SourceMapDevToolPlugin({
  //     publicPath: 'https://example.com/project/'
  //   }))
  // }

  /**
   * 生产环境配置
   */
  let minimizer = require('./build/minimizer')(env, args)

  // webpack 一般配置
  return {
    entry: {
      home: './src/pages/home/index.js'
    },
    output: {
      // publicPath: ''
    },
    // see https://webpack.js.org/configuration/module
    module: {
      // see https://webpack.js.org/configuration/module#modulerules
      rules: [
        {
          test: /\.m?js$/,
          include: directoryWhiteList,
          use: {
            loader: 'babel-loader',
            options: {
              // see https://github.com/babel/babel-loader#options
              // 缓存babel编译结果，加快下次编译速度
              cacheDirectory: true,
              // 缓存时是否压缩缓存。如果编译的文件非常多，不压缩虽然能提升编译性能，但是增加了磁盘空间占用率。
              cacheCompression: false
            }
          }
        },
        // 添加pcss支持
        {
          test: /\.p?css$/,
          include: directoryWhiteList,
          use: cssPreprocessors
        },
        // 添加scss支持
        {
          test: /\.s[ca]ss$/,
          include: directoryWhiteList,
          use: sassPreprocessors
        }
      ]
    },
    // devtool: false,
    optimization: {
      minimizer: minimizer,
      /**
       * You would inspect if tree shaking works as normal.
       * See https://webpack.js.org/configuration/optimization/#optimizationusedexports
       * optimization.usedExports is enabled in production mode and disabled elsewise.
       */
      usedExports: true
    },
    plugins: plugins
  }
}
