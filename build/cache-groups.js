const { isDev } = require('./env')
module.exports = (env, args) => ({
  /**
   * cacheGroups保持vendors、default的默认值已经是最优配置
   * @see https://webpack.js.org/plugins/split-chunks-plugin/#optimizationsplitchunks
   *
   * cacheGroup中的配置并不会帮你降低首屏脚本初始下载总量（单位kb）
   *
   * cacheGroups可以让你对默认配置不满意时，有选择性的选择合并或分离策略来达到size、cache与requests之间的平衡。
   * https://webpack.js.org/plugins/split-chunks-plugin/#configuration
   *
   * 改善应用的引用关系是降低首屏脚本初始下载总量的努力方向。
   *
   * 以下属性配置加上debug开关，仅仅是为了调试场景使用
   */
  vendors: {
    // test: /[\\/]node_modules[\\/]/,
    // chunks: 'initial',
    name: args.debug
      /**
       * 方便审查载入了哪些npm包
       */
      ? (module, chunks, cacheGroupKey) => {
      // get the name. E.g. node_modules/packageName/not/this/part.js
      // or node_modules/packageName
        const matches = module.context.match(/([\\/]node_modules[\\/]|[\\/]\.registry\.npmjs\.org[\\/])([@a-z\-~]+)([\\/][\d.\-_]+)?/i)
        const packageName = matches[2]
        // npm package names are URL-safe, but some servers don't like @ symbols
        return `npm.${packageName.replace(/@/g, '').replace(/[\\/]/g, '_')}`
      }
      /**
       * It is recommended to set splitChunks.name to false for production builds so that it doesn't change names unnecessarily.
       * https://webpack.js.org/plugins/split-chunks-plugin/#splitchunksname
       */
      : isDev(args.mode),
    /**
     * 本规则使用split chunk的默认设置，但排除调试模式场景
     * https://webpack.js.org/plugins/split-chunks-plugin/#splitchunkscachegroupscachegroupenforce
     */
    enforce: args.debug
  },
  /**
   * 关键资源分离规则
   * 优先级最高，配合html-webpack-plugin的插件
   * style-ext-html-webpack-plugin和script-ext-html-webpack-plugin
   * 将会把关键资源inline到入口html中
   *
   * 注意事项
   * webpack并不会递归地将带有critical关键词的模块依赖一起分离出来
   * 比如 a.critical.js 依赖了 b.js，那么a.critical.js可以被分离出来并内嵌到html中，但b.js并不会。
   *
   * @example
   * 总体使用规则是为文件或文件夹带上critical或inline关键词即可
   * 为文件名带上critical关键词
   * xxx.critical.js
   * xxx.critical.css
   * 为文件夹带上critical关键词
   * xxx-critical/*.*
   */
  // critical: {
  //   test: /critical|inline/i,
  //   // 排除async模块。async module通常是import()方式分离出按需加载的异步模块
  //   // 实测就算写成chunks: all，async模块也不会受到影响
  //   chunks: 'initial',
  //   // 本规则不受split chunk默认设置影响。see https://webpack.js.org/plugins/split-chunks-plugin/#splitchunkscachegroupscachegroupenforce
  //   enforce: true
  //
  //   // see https://webpack.js.org/plugins/split-chunks-plugin/#splitchunkscachegroupscachegroupreuseexistingchunk
  //   // reuseExistingChunk设置为true和false但区别 https://github.com/webpack/webpack.js.org/issues/2122#issuecomment-388609306
  //   // reuseExistingChunk: true
  // }

  // 还可以根据加载性能优化策略（Loading performance optimal strategy），定义更合理的分离配置
})
