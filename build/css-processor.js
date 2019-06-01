/**
 * 样式文件处理
 * npm i style-loader css-loader postcss-loader
 */
module.exports = (env, args) => {
  const _options = {
    sourceMap: !!args.devtool
  }
  return {
    styleLoader: () => ({
      // Adds CSS to the DOM by injecting a <style> tag see https://github.com/webpack-contrib/style-loader
      loader: 'style-loader',
      // options useable使用场景是手动控制css挂载/卸载 see https://juejin.im/post/5a2668996fb9a0450b663f20#heading-9
      options: {
        ..._options
      }
    }),

    cssLoader: opts => ({
      // The css-loader interprets @import and url() like import/require() and will resolve them.
      // see https://github.com/webpack-contrib/css-loader
      loader: 'css-loader',
      options: {
        ..._options,
        ...opts

        // 告诉 css-loader，在被处理之前有多少个loader也会处理 @import and url()
        // see https://github.com/webpack-contrib/css-loader#importloaders
        // 关于该选项的解释 https://github.com/webpack-contrib/css-loader/issues/228#issuecomment-312885975
        // importLoaders: 1

        // 启用css module特性 https://github.com/webpack-contrib/css-loader#modules
        // modules: true,
      }
    }),

    postcssLoader: () => ({
      // PostCSS is a tool for transforming styles with JS plugins
      // see https://github.com/postcss/postcss
      // postcss-loader see https://github.com/postcss/postcss-loader
      loader: 'postcss-loader',
      options: {
        // ..._options
        sourceMap: args.devtool
          ? (/inline/i.test(args.devtool) ? 'inline' : true)
          : false
      }
    }),

    sassLoader: () => ({
      // Loads a Sass/SCSS file and compiles it to CSS.
      // see https://github.com/webpack-contrib/sass-loader
      loader: 'sass-loader',
      options: {
        ..._options
      }
    })
  }
}
