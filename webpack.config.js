const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

// 将被loader处理的源码目录白名单
const directoryWhiteList = [
  path.resolve(__dirname, 'src')
]

module.exports = {
  entry: {
    home: './src/pages/home/index.js'
  },
  module: {
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
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/pages/home/index.html'
    })
  ]
}
