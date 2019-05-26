// see https://github.com/postcss/postcss-loader#configuration
module.exports = {
  plugins: {
    // https://github.com/csstools/postcss-preset-env
    // 将默认使用browsers list配置文件来断言需要支持的设备列表
    'postcss-preset-env': {
      // 使用stage 0尽量兼容更低版本的浏览器 https://github.com/csstools/postcss-preset-env#stage
      // 使用stage 0将css中使用的新特性视为实验性质，将经可能的转换成更低版本的css代码
      stage: 0,
      // see https://github.com/postcss/autoprefixer
      autoprefixer: {
        /**
         * 根据需要而选择是否让IE支持grid特性
         * Autoprefixer can be used to translate modern CSS Grid syntax
         * into IE 10 and IE 11 syntax, but this polyfill will not work in 100% of cases.
         * This is why it is disabled by default.
         * see https://github.com/postcss/autoprefixer#does-autoprefixer-polyfill-grid-layout-for-ie
         */
        // grid: true
      }
    }
  }
}
