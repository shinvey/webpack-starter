/**
 * webpack configuration exports a function
 * Environment Variables see https://webpack.js.org/guides/environment-variables
 * @param env 为args.env， see https://webpack.js.org/api/cli/#environment-options
 * @param {boolean} env.lint 是否对代码进行lint
 * @param {boolean} env.clean 是否清除缓存
 * @param args 命令行参数列表
 * @returns Object
 */
module.exports = (env, args) => {
  env = env || {}

  const path = require('path')
  const merge = require('webpack-merge')
  const webpack = require('webpack')
  const { isDev, isPrd, svcEnv } = require('./build/env')
  const SVC_ENV = svcEnv(args)

  // 将被loader处理的源码目录白名单
  const directoryWhiteList = [
    path.resolve('src')
  ]
  // 插件管理
  const plugins = []

  /**
   * 静态资源优化策略
   */
  const optimization = {
    // Extracting Boilerplate. See https://webpack.js.org/guides/caching/#extracting-boilerplate
    // 如果是多页应用，可以考虑分离runtime，在多个entry之间共享runtime
    runtimeChunk: 'single',

    // Chunk splitting see https://webpack.js.org/plugins/split-chunks-plugin/#split-chunks-example-2
    splitChunks: {
      cacheGroups: require('./build/cache-groups')(env, args)
    }
  }
  /**
   * Caching. See https://webpack.js.org/guides/caching/
   */
  // web dev server 只能用hash
  const hashType = isDev(args.mode) ? 'hash' : 'contenthash'
  // js、css等静态资源
  const filenamePattern = `assets/[name].[${hashType}:4]`
  const chunkFilenamePattern = `assets/[name].[${hashType}:4].chunk`
  // 图像、字体等静态资源
  const assetFilenamePattern = 'assets/[name].[hash:4]'
  // 避免chunk里的module ID因某个module更新ID发生连锁变化反应
  // Module Identifiers. See https://webpack.js.org/guides/caching/#module-identifiers
  isPrd(args.mode) && plugins.push(new webpack.HashedModuleIdsPlugin())

  // output configuration
  const output = {
    path: path.resolve('dist'),
    filename: `${filenamePattern}.js`,
    // Note the use of chunkFilename, which determines the name of non-entry chunk files.
    // https://webpack.js.org/configuration/output/#output-chunkfilename
    chunkFilename: `${chunkFilenamePattern}.js`
    // publicPath: 'http://127.0.0.1:8080/'
  }

  const fileManagerOptions = {
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
    }),
    postcssLoader,
    cssPreprocessor.sassLoader()
  ]
  const sassModulePreprocessors = Array.from(sassPreprocessors)
  sassModulePreprocessors[1] = cssPreprocessor.cssLoader({
    importLoaders: 2,
    modules: true
  })
  // less
  const lessPreprocessors = [
    styleLoader,
    cssPreprocessor.cssLoader({
      importLoaders: 2
    }),
    postcssLoader,
    cssPreprocessor.lessLoader({
      // Enable Inline JavaScript (Deprecated) http://lesscss.org/usage/#less-options-enable-inline-javascript-deprecated-
      // this is options used for @ant-design/pro-layout
      javascriptEnabled: true
    })
  ]

  // 媒体资源处理
  const assetProcessor = require('./build/asset-processor')(env, args)

  // 处理入口HTML模板，生成入口html文件
  const pages = require('./build/page-factory')(env, args)
  plugins.push(...pages.arrHtmlWebpackPlugin)

  // 抽离css。并且该插件对HMR相对于mini-css-extract-plugin支持的更好，
  // 实测中，后者并不能很好的工作 https://github.com/faceyspacey/extract-css-chunks-webpack-plugin
  const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')
  plugins.push(
    new ExtractCssChunks({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: `${filenamePattern}.css`,
      chunkFilename: `${chunkFilenamePattern}.css`,
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
  if (isPrd(args.mode)) {
    /**
     * 图像处理
     */
    // --env.clean开启则删除缓存
    env.clean && fileManagerOptions.onStart.delete.push('./node_modules/.cache/imagemin-webpack')
    // see https://github.com/itgalaxy/imagemin-webpack
    // Note: Make sure that plugin place after any plugins that add images or other assets which you want to optimized.
    const ImageminPlugin = require('imagemin-webpack')

    // Before importing imagemin plugin make sure you add it in `package.json` (`dependencies`) and install
    // const imageminGifsicle = require('imagemin-gifsicle')
    // https://www.npmjs.com/package/imagemin-svgo
    // const imageminSvgo = require('imagemin-svgo')

    // 无损压缩模式
    // const imageminJpegtran = require('imagemin-jpegtran')
    // const imageminOptipng = require('imagemin-optipng')

    // 有损压缩模式
    // const imageminMozjpeg = require('imagemin-mozjpeg')
    // const imageminPngquant = require('imagemin-pngquant')

    plugins.push(
      // Make sure that the plugin is after any plugins that add images, example `CopyWebpackPlugin`
      new ImageminPlugin({
        // 默认处理以下图像格式
        // test: /\.(jpe?g|png|gif|svg)$/i,
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
            // imageminGifsicle({
            //   // see https://github.com/imagemin/imagemin-gifsicle#interlaced
            //   interlaced: true
            // }),
            ['gifsicle', { interlaced: true }],
            // imageminSvgo({
            //   // What is viewBox?
            //   // See https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox
            //   // See https://blog.csdn.net/userkang/article/details/84770843
            //   removeViewBox: true
            // }),
            ['svgo', { plugins: [{ removeViewBox: true }] }],

            // 有损压缩模式
            /**
             * jpg以填充色方式存储图像，每块像素都存储着色值
             * see https://github.com/imagemin/imagemin-mozjpeg
             */
            // imageminMozjpeg({
            //   // Compression quality, in range 0 (worst) to 100 (perfect).
            //   // see https://github.com/imagemin/imagemin-mozjpeg#quality
            //   // 注意：quality值如果大于原图像quality的值，输出的图像反而会比原图像更大
            //   quality: 65
            // }),
            ['mozjpeg', { quality: 65 }],
            /**
             * png以索引色方式存储，索引色好比色板，画布上每块像素记录着颜色的索引
             * see https://github.com/imagemin/imagemin-pngquant
             */
            // imageminPngquant({
            //   /**
            //    * Instructs pngquant to use the least amount of colors required to meet or exceed the max quality. If conversion results in quality below the min quality the image won't be saved.
            //    * Min and max are numbers in range 0 (worst) to 1 (perfect), similar to JPEG.
            //    * 定义索引色数量的阈值，分为最低和最高，原始图片低于最低则不处理，高于最高则缩减到0.8
            //    * see https://github.com/imagemin/imagemin-pngquant#quality
            //    */
            //   quality: [0.65, 0.8]
            // }),
            ['pngquant', { quality: [0.65, 0.8] }]

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

  // 环境变量注入
  const packageJSON = require('./package.json')
  plugins.push(
    new webpack.DefinePlugin({
      env: {
        APP_VERSION: JSON.stringify(packageJSON.version),
        // webpack cli可以设置--env.SVC_ENV选项
        SVC_ENV: JSON.stringify(SVC_ENV)
      }
    })
  )

  // web dev server spa
  const devServer = {}
  // 单页应用路由模式
  if (env.spa) {
    if (typeof env.spa === 'string') {
      // 默认首页设置为spa入口制定的html
      devServer.index = env.spa
    }
    // 选项来源 https://webpack.js.org/configuration/dev-server/#devserverhistoryapifallback
    // 参数文档 https://github.com/bripkens/connect-history-api-fallback#index
    devServer.historyApiFallback = {
      index: '/'
    }
    // 单页应用路由，必须配置publicPath，在route到虚拟path路径时，可以确保资源加载路径正确
    output.publicPath = 'http://127.0.0.1:8080/'
  }

  /**
   * 审查编译输出的资源
   * 比如我想
   *  看看tree shaking是否生效了
   *  import引入的包实际编译输出的size是多大
   */
  if (env.inspect) {
    output.publicPath = 'http://127.0.0.1:8000/'
  }

  // webpack 一般配置
  return {
    entry: pages.entries,
    output: output,
    resolve: {
      extensions: [
        '.js',
        '.jsx',
        '.ts'
      ],
      alias: {
        /**
         * Tip:Consider using the faster and smaller ES6 build if targetting a modern environment
         * https://github.com/mobxjs/mobx#installation
         */
        mobx: path.resolve('node_modules/mobx/lib/mobx.es6.js')
      }
    },
    // see https://webpack.js.org/configuration/module
    module: {
      // see https://webpack.js.org/configuration/module#modulerules
      rules: [
        {
          test: /\.(m?js|ts)x?$/,
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
          test: cssPreprocessor.sassLoader.test,
          exclude: cssPreprocessor.sassLoader.moduleTest,
          include: directoryWhiteList,
          use: sassPreprocessors
        },
        // 添加scss module支持
        {
          test: cssPreprocessor.sassLoader.moduleTest,
          include: directoryWhiteList,
          use: sassModulePreprocessors
        },
        // 添加less支持
        {
          test: cssPreprocessor.lessLoader.test,
          // include: directoryWhiteList,
          use: lessPreprocessors
        },
        // 小于8k的小资源内嵌，反之则返回图像路径
        {
          test: /\.(jpe?g|png|webp|gif|svg|eot|ttf|woff|woff2)$/,
          // 排除Responsive Images使用场景的命名模式
          exclude: assetProcessor.responsiveLoader.test,
          include: directoryWhiteList,
          use: [
            assetProcessor.urlLoader({
              name: `${assetFilenamePattern}.[ext]`
            })
          ]
        },
        // Responsive Images 工程化实践配置
        {
          // 匹配xxx.srcset.jpg xxx.srcset.png
          test: assetProcessor.responsiveLoader.test,
          include: directoryWhiteList,
          use: [
            /**
             * 在Responsive Image场景下编译时间会较长，
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
              assetProcessor.responsiveLoader({
                name: `${assetFilenamePattern}-[width].[ext]`
              })
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
      usedExports: true,

      ...optimization
    },
    plugins: plugins,
    devServer: {
      host: '0.0.0.0',

      // 如果使用--open选项，则使用本机IP
      useLocalIp: true,

      // 自定义配置
      ...devServer

      // Shows a full-screen overlay in the browser when there are compiler errors or warnings. Disabled by default.
      // overlay: {
      //   warnings: true,
      //   errors: true
      // },

      // 可以实现一些mock功能
      // before: function(app, server) {
      //   app.get('/some/path', function(req, res) {
      //     res.json({ custom: 'response' });
      //   });
      // }
    }
  }
}
