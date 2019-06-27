module.exports = {
  presets: [
    // 转义ES6代码到ES5
    ['@babel/preset-env', { loose: true }],
    // support for typescript
    // 转义typescript https://devblogs.microsoft.com/typescript/typescript-and-babel-7/
    '@babel/preset-typescript',
    // 转义react jsx https://babeljs.io/docs/en/babel-preset-react
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

    /**
     * 启用 decorators https://mobx.js.org/best/decorators.html#enabling-decorator-syntax
     * make sure that @babel/plugin-proposal-decorators comes before @babel/plugin-proposal-class-properties.
     * Note that the legacy mode is important (as is putting the decorators proposal first). Non-legacy mode is WIP.
     * NOTE: Compatibility with @babel/plugin-proposal-class-properties
     * https://babeljs.io/docs/en/babel-plugin-proposal-decorators#note-compatibility-with-babel-plugin-proposal-class-properties
     */
    ['@babel/plugin-proposal-decorators', { 'legacy': true }],
    // 支持定义类静态属性属性语法
    // https://babeljs.io/docs/en/next/babel-plugin-proposal-class-properties.html
    ['@babel/plugin-proposal-class-properties', { 'loose': true }]
    // 支持类定义私有字段和方法。目前babel-eslint 10还没能很好支持
    // ['@babel/plugin-proposal-private-methods', { 'loose': true }]
  ]
}
