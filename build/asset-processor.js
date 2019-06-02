/**
 * 资源
 * npm i style-loader css-loader postcss-loader sass-loader node-sass
 */
module.exports = (env, args) => {
  return {
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
       */
      loader: 'url-loader',
      options: {
        limit: 8192,

        // Using file-loader options, see https://github.com/webpack-contrib/file-loader

        ...opts
      }
    })
  }
}
