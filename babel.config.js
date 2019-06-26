module.exports = {
  presets: [
    // 转义ES6代码到ES5
    '@babel/preset-env',
    // support for typescript
    // 转义typescript https://devblogs.microsoft.com/typescript/typescript-and-babel-7/
    '@babel/preset-typescript',
    // 转义react jsx
    '@babel/preset-react'
  ],
  plugins: [
    /**
     * 解决问题 Babel is injecting helpers into each file and bloating my code!
     * see https://github.com/babel/babel-loader#babel-is-injecting-helpers-into-each-file-and-bloating-my-code
     * 如果代码量多，将inline模式插入的helper代码改成以module形式从@babel/runtime包引入还是比较划算的
     * 可以根据启用和不启用两次的编译后的bundle大小进行比较，再决定是否使用
     * 如果不决定使用可以执行以下命令删除相关npm包
     * npm un @babel/plugin-transform-runtime @babel/runtime
     * 如果决定使用则需要安装
     * npm i @babel/plugin-transform-runtime @babel/runtime
     */
    // '@babel/plugin-transform-runtime'

    // 支持使用import() see https://babeljs.io/docs/en/next/babel-plugin-syntax-dynamic-import.html
    '@babel/plugin-syntax-dynamic-import',

    // 支持定义类属性
    // https://babeljs.io/docs/en/next/babel-plugin-proposal-class-properties.html
    ['@babel/plugin-proposal-class-properties', { 'loose': true }]
  ]
}
