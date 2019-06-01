/**
 * webpack 默认会使用Terser。这里如果要加上css minimizer，得覆盖minimizer的配置
 * 未找到在默认配置基础上扩充的办法
 * @param env
 * @param args
 * @returns {Array}
 */
module.exports = (env, args) => {
  let minimizer = []

  if (args.mode !== 'production') {
    return minimizer
  }

  // css minimizer. See https://github.com/NMFR/optimize-css-assets-webpack-plugin
  const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
  // plugins.push(new OptimizeCSSAssetsPlugin())
  minimizer.push(new OptimizeCSSAssetsPlugin({
    cssProcessorOptions: {
      /**
       * 该插件默认使用postcss插件体系的cssnano
       * source map配置 see https://github.com/postcss/postcss/blob/master/docs/source-maps.md
       */
      map: args.devtool ? {
        // 表示输出source map为文件
        inline: /inline/i.test(args.devtool),
        /**
         * 将会在css文件中添加 # sourceMappingURL=home.css.map
         */
        annotation: true
      } : false
    },
    cssProcessorPluginOptions: {
      // preset.
      // see https://cssnano.co/guides/presets
      // see https://cssnano.co/guides/optimisations
      preset: ['default', {
        // see https://cssnano.co/optimisations/discardcomments
        discardComments: {
          removeAll: true
        }
      }]
    },
    canPrint: true
  }))

  // js minimizer see https://github.com/webpack-contrib/terser-webpack-plugin
  const TerserJSPlugin = require('terser-webpack-plugin')
  minimizer.push(new TerserJSPlugin({
    cache: true,
    parallel: true,
    sourceMap: !!args.devtool

    // 如果想保留 |@preserve|@license|@cc_on 声明 see https://github.com/webpack-contrib/terser-webpack-plugin#extractcomments
  }))

  return minimizer
}
