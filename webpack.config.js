const path = require('path')
const cssPreprocessor = require('./build/css-processor')

// 将被loader处理的源码目录白名单
const directoryWhiteList = [
  path.resolve(__dirname, 'src')
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

/**
 * 样式文件处理
 */
const styleLoader = cssPreprocessor.styleLoader()
const postcssLoader = cssPreprocessor.postcssLoader()
const cssPreprocessors = [
  styleLoader,
  cssPreprocessor.cssLoader({
    importLoaders: 1
  }),
  postcssLoader
]
// const scssPreprocessors = [
//   styleLoader,
//   cssPreprocessor.cssLoader({
//     importLoaders: 2,
//     modules: true
//   }),
//   postcssLoader,
//   cssPreprocessor.scssLoader()
// ]

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
styleLoader.loader = MiniCssExtractPlugin.loader

module.exports = {
  entry: {
    home: './src/pages/home/index.js'
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
      // 添加scss支持
      {
        test: /\.p?css$/,
        include: directoryWhiteList,
        use: cssPreprocessors
      }
    ]
  },
  optimization: {
    /**
     * You would inspect if tree shaking works as normal.
     * See https://webpack.js.org/configuration/optimization/#optimizationusedexports
     * optimization.usedExports is enabled in production mode and disabled elsewise.
     */
    usedExports: true
  },
  plugins: plugins
}
