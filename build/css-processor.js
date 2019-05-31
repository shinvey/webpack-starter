/**
 * 样式文件处理
 * npm i style-loader css-loader postcss-loader
 */

exports.styleLoader = () => ({
  // Adds CSS to the DOM by injecting a <style> tag see https://github.com/webpack-contrib/style-loader
  loader: 'style-loader'
  // options useable使用场景是手动控制css挂载/卸载 see https://juejin.im/post/5a2668996fb9a0450b663f20#heading-9
})

exports.cssLoader = opts => ({
  // The css-loader interprets @import and url() like import/require() and will resolve them.
  // see https://github.com/webpack-contrib/css-loader
  loader: 'css-loader',
  options: {
    ...opts
    // 告诉 css-loader，在被处理之前有多少个loader也会处理 @import and url()
    // see https://github.com/webpack-contrib/css-loader#importloaders
    // importLoaders: 1
    // 启用css module特性 https://github.com/webpack-contrib/css-loader#modules
    // modules: true,
  }
})

exports.postcssLoader = () => ({
  // PostCSS is a tool for transforming styles with JS plugins
  // see https://github.com/postcss/postcss
  // postcss-loader see https://github.com/postcss/postcss-loader
  loader: 'postcss-loader'
})

exports.sassLoader = () => ({
  loader: 'sass-loader'
})
