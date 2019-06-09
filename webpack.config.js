/**
 * webpack configuration exports a function
 * Environment Variables see https://webpack.js.org/guides/environment-variables
 * @param env 为args.env， see https://webpack.js.org/api/cli/#environment-options
 * @param args 命令行参数列表
 * @returns Object
 */
module.exports = (env = {}, args) => {
  const path = require('path')
  const merge = require('webpack-merge')

  // 将被loader处理的源码目录白名单
  const directoryWhiteList = [
    path.resolve(__dirname, 'src')
  ]

  // output configuration
  const output = {
    path: path.resolve(__dirname, 'dist')
    // publicPath: 'https://example.com/'
  }

  /**
   * 样式文件处理
   */
  const cssPreprocessor = require('./build/css-processor')(env, args)
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

  // 媒体资源处理
  const assetProcessor = require('./build/asset-processor')(env, args)

  // 插件管理
  const plugins = []

  // 处理HTML
  const HtmlWebpackPlugin = require('html-webpack-plugin')
  plugins.push(
    new HtmlWebpackPlugin({
      template: './src/pages/home/index.html'
    })
  )

  // 抽离css。并且该插件对HMR相对于mini-css-extract-plugin支持的更好，
  // 实测中，后者并不能很好的工作 https://github.com/faceyspacey/extract-css-chunks-webpack-plugin
  const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')
  plugins.push(
    new ExtractCssChunks({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
      orderWarning: true // Disable to remove warnings about conflicting order between imports
    })
  )
  // 替换style loader就可以抽离css文件了
  styleLoader.loader = ExtractCssChunks.loader
  if (args.hot) {
    styleLoader.options = merge(styleLoader.options, {
      hot: true, // if you want HMR - we try to automatically inject hot reloading but if it's not working, add it to the config
      reloadAll: true // when desperation kicks in - this is a brute force HMR flag
    })
  }

  /**
   * 工程文件管理
   */
  let fileManagerOptions = {}
  // 缓存清理
  if (env.clean) {
    fileManagerOptions = merge(fileManagerOptions, {
      onStart: {
        delete: []
      }
    })
    // 清理webpack output
    fileManagerOptions.onStart.delete.push(output.path)
    // 清理cache-loader缓存
    fileManagerOptions.onStart.delete.push(assetProcessor.cacheLoader().options.cacheDirectory)
  }
  if (['clean', 'zip'].some(cliOpt => cliOpt in env)) {
    const FileManagerPlugin = require('filemanager-webpack-plugin')
    plugins.push(
      new FileManagerPlugin(fileManagerOptions)
    )
  }

  /**
   * 生产环境配置
   */

  // webpack 一般配置
  return {
    entry: {
      home: './src/pages/home/index.js'
    },
    output: output,
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
        },
        // 小于8k的小资源内嵌
        {
          test: /\.(gif|svg|eot|ttf|woff|woff2)$/,
          include: directoryWhiteList,
          use: [
            assetProcessor.urlLoader()
          ]
        },
        // Responsive Images 工程化实践配置
        {
          test: /\.(jpe?g|png)$/i,
          include: directoryWhiteList,
          use: [
            /**
             * 在Responsive Image场景下编译实践会较长，
             * 这里有选择性的使用cache-loader来缓存编译结果。
             * 在启用cache-loader后，第二次编译你会发现，已经不再输出被responsive-loader
             * 处理的图像资源了。如果你需要重新处理图像可以选择删除cache-loader的缓存。
             * cache-loader缓存位置请查看cacheDirectory选项
             *
             * 相关问题
             * Cache loader? https://github.com/herrstucki/responsive-loader/issues/52
             */
            assetProcessor.cacheLoader(),
            assetProcessor.urlLoader({
              // 如果图像大小大于8k则使用responsive-loader来处理，此处的options下的配置会全部传给responsive-loader
              fallback: 'responsive-loader',
              // Using responsive-loader options, see https://github.com/herrstucki/responsive-loader
              adapter: require('responsive-loader/sharp'),
              /**
               * sizes 在使用前应做好终端屏幕尺寸分布情况的数据分析，确定好一组适配的分辨率后，
               * 就可以定好使用sizes定好一组图像宽度，在代码中引用图像时就不必再次声明
               * 用例可以查阅 https://github.com/herrstucki/responsive-loader#usage
               * 从一组srcset中，浏览器如何选择合适的src？ 答案是DPR，请看浏览器的算法 https://css-tricks.com/responsive-images-youre-just-changing-resolutions-use-srcset/#article-header-id-0
               */
              sizes: [300, 600, 1200, 2000]
              /**
               * placeholder 是否使用占位图像功能
               * 该场景适用于我们没有自己的placeholder图像，也不是非常在意placeholder图像的款式
               * 那么就可以选用responsive-loader为我们准备的placeholder功能
               * 用例可以查看placeholder部分 https://github.com/herrstucki/responsive-loader#usage
               */
              // placeholder: true,
              // placeholderSize: 50
            })
          ]
        }
      ]
    },
    optimization: {
      /**
       * You would inspect if tree shaking works as normal.
       * See https://webpack.js.org/configuration/optimization/#optimizationusedexports
       * optimization.usedExports is enabled in production mode and disabled elsewise.
       *
       * 如果你启用usedExports选项审查编译后的代码，如果能够看到类似unused harmony export字样
       * 就说明该块代码能够被正常tree shaking
       *
       * 对应的cli 选项是 --display-used-exports，截至webpack 4.30版本，该选项似乎并不凑效
       */
      usedExports: true
    },
    plugins: plugins,
    devServer: {
      host: '0.0.0.0'
    }
  }
}
