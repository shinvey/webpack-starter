module.exports = {
  presets: [
    // 转义ES6代码到ES5
    '@babel/preset-env'
  ],
  plugins: [
    /**
     * 解决问题 Babel is injecting helpers into each file and bloating my code!
     * see https://github.com/babel/babel-loader#babel-is-injecting-helpers-into-each-file-and-bloating-my-code
     * 如果代码量多，将inline模式插入的helper代码改成以module形式从@babel/runtime包引入还是比较划算的
     * 可以根据启用和不启用两次的编译后的bundle大小进行比较，再决定是否使用
     */
    '@babel/plugin-transform-runtime'
  ]
}
