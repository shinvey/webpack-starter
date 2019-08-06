/**
 * 样式文件处理
 * npm i style-loader css-loader postcss-loader sass-loader node-sass
 */
module.exports = (env, args) => {
  const _options = {
    sourceMap: !!args.devtool
  }
  const processors = {
    styleLoader: () => ({
      // Adds CSS to the DOM by injecting a <style> tag see https://github.com/webpack-contrib/style-loader
      loader: 'style-loader',
      // options useable使用场景是手动控制css挂载/卸载 see https://juejin.im/post/5a2668996fb9a0450b663f20#heading-9
      options: {
        // source map see https://github.com/webpack-contrib/style-loader#sourcemap
        ..._options
      }
    }),

    cssLoader: opts => ({
      // The css-loader interprets @import and url() like import/require() and will resolve them.
      // see https://github.com/webpack-contrib/css-loader
      loader: 'css-loader',
      options: {
        // source map see https://github.com/webpack-contrib/css-loader#sourcemap
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
        // source map see https://github.com/postcss/postcss-loader#sourcemap
        sourceMap: args.devtool
          ? (/inline/i.test(args.devtool) ? 'inline' : true)
          : false,

        // postcss loader config. See https://github.com/postcss/postcss-loader#config
        config: {
          // postcss-loader exposes context ctx to the config file, making your postcss.config.js dynamic, so can use it to do some real magic
          // see https://github.com/postcss/postcss-loader#context-ctx
          ctx: {
            // 将env, args两个环境变量传递给postcss.config.js
            env,
            args
          }
        }
      }
    }),

    sassLoader: () => ({
      // Loads a Sass/SCSS file and compiles it to CSS.
      // see https://github.com/webpack-contrib/sass-loader
      loader: 'sass-loader',
      options: {
        // source map see https://github.com/webpack-contrib/sass-loader#source-maps
        ..._options
      }
    }),

    lessLoader: () => ({
      // A Less loader for webpack. Compiles Less to CSS.
      // see https://github.com/webpack-contrib/less-loader
      loader: 'less-loader',
      options: {
        // source map see https://github.com/webpack-contrib/less-loader#source-maps
        ..._options
      }
    })
  }

  processors.sassLoader.test = /\.s[ca]ss$/
  processors.sassLoader.moduleTest = /module\.s[ca]ss$/

  processors.lessLoader.test = /\.less$/

  return processors
}
