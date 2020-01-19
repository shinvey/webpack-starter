module.exports = {
  presets: [
    // 转义ES6代码到ES5
    [
      '@babel/preset-env',
      {
        /**
         * babel的polyfill方案
         * core-js 需要配合 useBuiltIns 共同使用
         * 需要安装core-js依赖 npm i core-js@3
         *
         * 如果不想使用babel的polyfill方案可以选用运行时polyfill service方案
         * 优势按需加载，劣势是需要更具对js api依赖情况定制polyfill service的url
         * 选用Polyfill service可以查看 https://polyfill.io/
         */
        // useBuiltIns: 'usage',
        // corejs: 3,

        /**
         * modules选项见 https://babeljs.io/docs/en/babel-preset-env#modules
         * auto的含义见 https://github.com/babel/babel/pull/8485/files#r236086742
         * auto的含义解释
         * 'auto' (default) which will automatically select 'false' if the current
         * process is known to support ES module syntax, or "commonjs" otherwise
         * For example, if you are calling Babel using babel-loader, modules will be set to false because webpack supports ES modules
         */
        // modules: 'auto', // 如果我们使用webpack，modules将为false

        /**
         * loose模式会在browserslist对低版本运行环境的query输出更少量的代码
         * loose模式会导致，会使这种表达式 [...Array(5).keys()] 无法得到预期结果
         * loose模式在新项目启动使使用比较安全。对已有项目使用，可能会引发未知问题
         */
        // loose: true,

        /**
         * 如果你想确认babel是否真正使用了browserlist的配置文件，
         * 或者core js polyfill方案是否启用，可以开启babel调试模式查看更多信息。
         * 如果你想反复调试，可以考虑关闭babel的cacheDirectory选项，设置为false。
         */
        // 'debug': true,
        exclude: [
          // 包列表 https://github.com/babel/babel/blob/master/packages/babel-preset-env/src/available-plugins.js
          /**
           * 如果我们已经采用polyfill service，且浏览器已经支持async/await/generator
           * 语法则可以选择不使用regenerator转换async/await/generator语法
           */

          // 转换async为generator语法
          'transform-async-to-generator',
          // '@babel/plugin-transform-async-to-generator',

          /**
           * 转换generator为低版本浏览器能够运行的代码
           * transform-regenerator https://babeljs.io/docs/en/babel-plugin-transform-regenerator
           * 已经支持async/await/generator语法的转换，他不需要和transform-async-to-generator
           * 同时使用
           */
          // 'transform-regenerator',
          // '@babel/plugin-transform-regenerator',
        ]
      }
    ],
    // support for typescript
    // 转义typescript https://devblogs.microsoft.com/typescript/typescript-and-babel-7/
    '@babel/preset-typescript',
    // 转义react jsx https://babeljs.io/docs/en/babel-preset-react
    '@babel/preset-react'
  ],
  plugins: [
    /**
     * 新版本可以在@babel/preset-env中配置使用core js和helper等特性
     *
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

    /**
     * 支持使用import() see https://babeljs.io/docs/en/next/babel-plugin-syntax-dynamic-import.html
     * Note: @babel/preset-env v7.5.0 已经开始内置支持import() https://github.com/babel/babel/pull/10109
     */
    // '@babel/plugin-syntax-dynamic-import',

    // 支持 export * as namespace 语法 https://babeljs.io/docs/en/next/babel-plugin-proposal-export-namespace-from.html
    '@babel/plugin-proposal-export-namespace-from',
    /**
     * 启用 decorators https://mobx.js.org/best/decorators.html#enabling-decorator-syntax
     * make sure that @babel/plugin-proposal-decorators comes before @babel/plugin-proposal-class-properties.
     * Note that the legacy mode is important (as is putting the decorators proposal first). Non-legacy mode is WIP.
     * NOTE: Compatibility with @babel/plugin-proposal-class-properties
     * https://babeljs.io/docs/en/babel-plugin-proposal-decorators#note-compatibility-with-babel-plugin-proposal-class-properties
     */
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    // 支持定义类静态属性属性语法
    // https://babeljs.io/docs/en/next/babel-plugin-proposal-class-properties.html
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    // 支持类定义私有字段和方法。目前babel-eslint 10还没能很好支持
    // ['@babel/plugin-proposal-private-methods', { 'loose': true }]
    // 按需加载UI组件库 https://github.com/ant-design/babel-plugin-import#options
    // ['import', {
    //   libraryName: 'antd',
    //   style: true
    // }, 'antd'],
    ['import', {
      libraryName: 'antd-mobile',
      style: true
    }, 'antd-mobile'],
    // for ant-design-pro
    // ['import', {
    //   libraryName: 'ant-design-pro',
    //   style: true,
    //   camel2DashComponentName: false
    // }, 'ant-design-pro'],
    /**
     * for antd pro layout
     * 请使用具体路径引用BasicLayout路径引用其子组件
     */
    // ['import', {
    //   libraryName: '@ant-design/pro-layout',
    //   style: name => {
    //     return `${name}.less`
    //   },
    //   camel2DashComponentName: false
    // }, 'ant-design-pro-layout'],
    ['import', {
      libraryName: 'lodash',
      libraryDirectory: '',
      camel2DashComponentName: false // default: true
    }, 'lodash'],

    // 启用react hot loader https://github.com/gaearon/react-hot-loader
    ['react-hot-loader/babel'],
    /**
     * 为react组件的异常信息调用堆栈添加文件名和行数信息
     * Component Stack Traces https://reactjs.org/docs/error-boundaries.html#component-stack-traces
     * 对应babel插件 @babel/plugin-transform-react-jsx-source https://babeljs.io/docs/en/next/babel-plugin-transform-react-jsx-source.html
     */
  ]
}
