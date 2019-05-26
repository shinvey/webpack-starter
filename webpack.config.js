const path = require('path')

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

// 样式文件处理
const styleLoader = {
  // Adds CSS to the DOM by injecting a <style> tag see https://github.com/webpack-contrib/style-loader
  loader: 'style-loader'
  // options useable使用场景是手动控制css挂载/卸载 see https://juejin.im/post/5a2668996fb9a0450b663f20#heading-9
}

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
      },
      // 添加scss支持
      {
        test: /\.p?css$/,
        include: directoryWhiteList,
        use: [
          styleLoader,
          {
            // The css-loader interprets @import and url() like import/require() and will resolve them.
            // see https://github.com/webpack-contrib/css-loader
            loader: 'css-loader',
            options: {
              // 告诉 css-loader，在被处理之前有多少个loader也会处理 @import and url()
              // see https://github.com/webpack-contrib/css-loader#importloaders
              importLoaders: 1
              // 启用css module特性 https://github.com/webpack-contrib/css-loader#modules
              // modules: true,
            }
          },
          {
            // PostCSS is a tool for transforming styles with JS plugins
            // see https://github.com/postcss/postcss
            // postcss-loader see https://github.com/postcss/postcss-loader
            loader: 'postcss-loader'
          }
        ]
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
