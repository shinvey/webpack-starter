const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    home: './src/pages/home/index.js'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        // 编译文件跳过node_modules下的模块
        exclude: /node_modules/,
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
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/pages/home/index.html'
    })
  ]
}
