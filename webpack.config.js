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
    // filename: '[name].js',
    // Note the use of chunkFilename, which determines the name of non-entry chunk files.
    // https://webpack.js.org/configuration/output/#output-chunkfilename
    // chunkFilename: '[name].bundle.js'
    // publicPath: 'https://example.com/'
  }

  let fileManagerOptions = {
    onStart: {
      delete: []
    }
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
  // see https://github.com/jantimon/html-webpack-plugin
  const HtmlWebpackPlugin = require('html-webpack-plugin')
  plugins.push(
    new HtmlWebpackPlugin({
      // More options see https://github.com/jantimon/html-webpack-plugin#options
      // cache: true, // cache默认启用
      template: './src/pages/home/index.ejs',
      templateParameters: {
        args
      }
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
   * 生产环境配置
   */
  if (args.mode === 'production') {
    /**
     * 图像处理
     */
    // --env.clean开启则删除缓存
    env.clean && fileManagerOptions.onStart.delete.push('./node_modules/.cache/imagemin-webpack')
    // see https://github.com/itgalaxy/imagemin-webpack
    // Note: Make sure that plugin place after any plugins that add images or other assets which you want to optimized.
    const ImageminPlugin = require('imagemin-webpack')

    // Before importing imagemin plugin make sure you add it in `package.json` (`dependencies`) and install
    const imageminGifsicle = require('imagemin-gifsicle')
    const imageminSvgo = require('imagemin-svgo')

    // 无损压缩模式
    // const imageminJpegtran = require('imagemin-jpegtran')
    // const imageminOptipng = require('imagemin-optipng')

    // 有损压缩模式
    const imageminMozjpeg = require('imagemin-mozjpeg')
    const imageminPngquant = require('imagemin-pngquant')

    plugins.push(
      // Make sure that the plugin is after any plugins that add images, example `CopyWebpackPlugin`
      new ImageminPlugin({
        bail: false, // Ignore errors on corrupted images
        // cache option see https://github.com/itgalaxy/imagemin-webpack#cache
        cache: !env.clean, // 如果--env.clean开关开启，则不启用cache
        include: directoryWhiteList,
        // 过滤responsiveLoader使用场景
        exclude: assetProcessor.responsiveLoader.test,
        imageminOptions: {
          // Lossless optimization with custom option
          // Feel free to expirement with options for better result for you
          // progressive and interlaced rendering的差异 see https://blog.codinghorror.com/progressive-image-rendering/
          plugins: [
            // see https://github.com/imagemin/imagemin-gifsicle
            imageminGifsicle({
              // see https://github.com/imagemin/imagemin-gifsicle#interlaced
              interlaced: true
            }),
            imageminSvgo({
              // What is viewBox?
              // See https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox
              // See https://blog.csdn.net/userkang/article/details/84770843
              removeViewBox: true
            }),

            // 有损压缩模式
            /**
             * jpg以填充色方式存储图像，每块像素都存储着色值
             * see https://github.com/imagemin/imagemin-mozjpeg
             */
            imageminMozjpeg({
              // Compression quality, in range 0 (worst) to 100 (perfect).
              // see https://github.com/imagemin/imagemin-mozjpeg#quality
              // 注意：quality值如果大于原图像quality的值，输出的图像反而会比原图像更大
              quality: 65
            }),
            /**
             * png以索引色方式存储，索引色好比色板，画布上每块像素记录着颜色的索引
             * see https://github.com/imagemin/imagemin-pngquant
             */
            imageminPngquant({
              /**
               * Instructs pngquant to use the least amount of colors required to meet or exceed the max quality. If conversion results in quality below the min quality the image won't be saved.
               * Min and max are numbers in range 0 (worst) to 1 (perfect), similar to JPEG.
               * 定义索引色数量的阈值，分为最低和最高，原始图片低于最低则不处理，高于最高则缩减到0.8
               * see https://github.com/imagemin/imagemin-pngquant#quality
               */
              quality: [0.65, 0.8]
            })

            // 无损压缩模式
            // imageminJpegtran({
            //   progressive: true
            // }),
            // imageminOptipng({
            //   optimizationLevel: 5
            // }),
          ]
        }
      }))
  }

  /**
   * 工程文件管理
   */
  // 缓存清理
  if (env.clean) {
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
        // 小于8k的小资源内嵌，反之则返回图像路径
        {
          test: /\.(jpe?g|png|gif|svg|eot|ttf|woff|woff2)$/,
          // 排除Responsive Images使用场景的命名模式
          exclude: assetProcessor.responsiveLoader.test,
          include: directoryWhiteList,
          use: [
            assetProcessor.urlLoader()
          ]
        },
        // Responsive Images 工程化实践配置
        {
          // 匹配xxx.srcset.jpg xxx.srcset.png
          test: assetProcessor.responsiveLoader.test,
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
            assetProcessor.urlLoader(
              assetProcessor.responsiveLoader()
            )
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
