/**
 * 资源
 * npm i style-loader css-loader postcss-loader sass-loader node-sass
 */
module.exports = (env, args) => {
  const processors = {
    /**
     * Note that there is an overhead for saving the reading and saving the cache file,
     * so only use this loader to cache expensive loaders.
     * cache-loader磁盘I/O开销大，它更适用于耗时很长的loader
     * see https://github.com/webpack-contrib/cache-loader
     */
    cacheLoader: opts => ({
      loader: 'cache-loader',
      // see https://github.com/webpack-contrib/cache-loader#options
      options: {
        cacheDirectory: './node_modules/.cache/cache-loader',
        ...opts
      }
    }),
    urlLoader: opts => ({
      /**
       * url loader, A loader for webpack which transforms files into base64 URIs
       * It's also important that you can specify size limit for url-loader.
       * It will automatically fall back to file-loader for all files beyond this size:
       * see https://github.com/webpack-contrib/url-loader
       *
       * 相关问题
       * Images and css-loader Source Map Gotcha https://survivejs.com/webpack/loading/images/#images-and-css-loader-source-map-gotcha
       */
      loader: 'url-loader',
      options: {
        limit: 8192,

        // Using file-loader options, see https://github.com/webpack-contrib/file-loader

        ...opts
      }
    }),
    responsiveLoader: opts => ({
      // 如果图像大小大于8k则使用responsive-loader来处理，此处的options下的配置会全部传给responsive-loader
      // https://github.com/herrstucki/responsive-loader
      fallback: 'responsive-loader',
      // Using responsive-loader options, see https://github.com/herrstucki/responsive-loader#options
      adapter: require('responsive-loader/sharp'),
      /**
       * sizes 在使用前应做好终端屏幕尺寸分布情况的数据分析，确定好一组适配的分辨率后，
       * 就可以定好使用sizes定好一组图像宽度，在代码中引用图像时就不必再次声明
       * 用例可以查阅 https://github.com/herrstucki/responsive-loader#usage
       * 从一组srcset中，浏览器如何选择合适的src？ 答案是DPR，请看浏览器的算法 https://css-tricks.com/responsive-images-youre-just-changing-resolutions-use-srcset/#article-header-id-0
       */
      sizes: [300, 600, 1200, 2000],
      // jpg默认压缩率为85
      // quality: 85,
      /**
       * placeholder 是否使用占位图像功能
       * 该场景适用于我们没有自己的placeholder图像，也不是非常在意placeholder图像的款式
       * 那么就可以选用responsive-loader为我们准备的placeholder功能
       * 用例可以查看placeholder部分 https://github.com/herrstucki/responsive-loader#usage
       */
      // placeholder: true,
      // placeholderSize: 50

      ...opts
    })
  }

  processors.responsiveLoader.test = /srcset\.(jpe?g|png)$/i

  return processors
}
