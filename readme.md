# webpack-spa-react

> 项目描述

# 技术栈

## 命令行工具
1. webpack(模块打包)
1. npm/yarn(包管理)

## 编程语言
1. TypeScript(静态类型检查)
1. ES6

## 代码检查
1. ESLint/TSLint

## 代码格式化
1. prettier(代码格式化)

## CSS预处理器
1. SASS/SCSS

## UI构建
1. React

## 状态管理
1. Redux

## 响应式编程
1. redux-observable(RxJS与React结合的中间件)

## 单页应用路由
1. React-Router

## 工具函数库
1. lodash

## 通用IDE配置
1. editorconfig

## 同步测试
1. Webpack dev server/Browsersync

## 网页加载性能监控
1. lighthouse

## Bundle分析
1. webpack bundle analyzer

## 已经弃用或停止维护的
1. typings

# 环境搭建
## 配置npm
生成[package.json](package.json)
```bash
npm init -y
```
将npm项目设置为私有，修改package.json添加以下属性
```json
{
  "private": true
}
```
[为什么要设为私有？](https://docs.npmjs.com/files/package.json#private)

## 配置Webpack
```bash
npm install webpack webpack-cli -S
npm i @webpack-cli/init -D
npx webpack-cli init
```
添加在npm script中添加命令快捷方式
```json
{
  "scripts": {
    "build:development": "webpack --mode development -d",
    "build:production": "webpack --mode production -p"
  }
}
```

## 添加eslint
npm i eslint -D
npx eslint --init

## 添加babel loader
```bash
npm i @babel/core babel-loader -S
```
```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.m?js$/,
        // 编译文件跳过node_modules下的模块
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            // presets: ['@babel/preset-env']

            // see https://github.com/babel/babel-loader#options
            // 缓存babel编译结果，加快下次编译速度
            cacheDirectory: true,
            // 缓存时是否压缩缓存。如果编译的文件非常多，不压缩虽然能提升编译性能，但是增加了磁盘空间占用率。
            cacheCompression: false
          }
        }
      }
    ]
  },
  // ...
}

```
支持将es6转换成es5
```bash
npm install @babel/preset-env --save
```
```js
// babel.config.js
module.exports = {
  // 转义ES6代码到ES5
  presets: ['@babel/preset-env']
}
```
解决问题：Babel is injecting helpers into each file and bloating my code!
```bash
npm install @babel/plugin-transform-runtime @babel/runtime
```
```js
// babel.config.js
module.exports = {
  // ...
  plugins: ['@babel/plugin-transform-runtime']
}
```

## 添加scss支持
## css module支持或组件级样式书写方案
1. css-loader
1. [styled-jsx](https://github.com/zeit/styled-jsx)
## postcss支持
1. postcss preset env
1. PostCSS Utility Library
    1. postcss-utilities

## 添加react支持

## 编码规范
__js代码书写规范 eslint__
```bash
npm i -D eslint
```
__样式书写规范 stylelint__
```bash
npm i -D stylelint stylelint-config-standard
```
__样式属性排列顺序__

IDE对此项特性支持不太广泛

__持续保持书写规范 prettier__

1. [Integrating with Linters](https://prettier.io/docs/en/integrating-with-linters.html)
1. [How to integrate Prettier with ESLint and stylelint](https://www.freecodecamp.org/news/integrating-prettier-with-eslint-and-stylelint-99e74fede33f/)

### 编译时检查

### 配置IDE支持
__vs code__

__WebStorm__

[webstorm stylelint fix](https://stackoverflow.com/questions/54304313/stylelint-fix-in-webstorm)

## 开发调试支持
js sourcemap
css sourcemap
对比以下两个plugin的使用场景
extract-css-chunks-webpack-plugin
mini-css-extract-plugin

# 兼容性处理
## modernizer
## css autoprefix
## browserlist
## polyfill支持
## 可选支持webp

# 工程优化
## 基本静态资源优化
HTML压缩
CSS压缩
JS压缩
图像优化

## 首屏加载性能优化
骨架HTML
关键CSS
代码分离和长效缓存
响应式图片
滚动懒加载
预加载

## 工程编译性能优化
提升编译性能

## 工程监控
bundle大小监控

# todo用例
带网络请求的

# To be continue
https://survivejs.com/webpack/developing/getting-started/

## 启动本地开发环境（Develoment）

``` bash
# 启动带有hot reload的开发服务（serve with hot reload at localhost:8010）
npm run dev
# 如果你想自动打开demo url
npm run dev:open
```

[手动访问demo url](http://localhost:8010/demo.html)

## 编译（Build）

### 编译项目（Build the project）
共有三种编译选项，满足测试和生产的发布需求
``` bash
# 编译适用于测试环境的代码（build for staging）
npm run build:staging
# 如果你想顺便打个zip包……
npm run build:staging:zip

# 编译适用于测试环境的代码并压缩（build for staging with minification）
npm run build:staging:minify

# 编译适用于生产环境的代码（build for production with minification）
npm run build:prd
# 如果你想顺便打个zip包……
npm run build:prd:zip
```

### 启动[web service api](src/assets/business/wsapi.js)数据挡板服务
并顺便对[dist](dist)启动web服务(Start a example web+mock server)

``` bash
npm run mock
```

[访问编译后的demo url](http://localhost:2333/demo.html)

### 编译性能分析

#### Minimal build size of basic requirement
The build size with basic requirement on Chrome 66
* webpack 1.2k
* webpack + vue ~60k
* webpack + vue + vux ~86k
* webpack + vue + vux + lodash ~94k

#### 编译后的包大小分析（Analysis bundle size）
``` bash
npm run build:profile
```

## Webstorm无法对import中的别名路径进行解析
Webstorm默认寻找项目根路径下的webpack.config.js中resolve.alias配置，但是当前工程配置相对复杂，
已将他们全部移动build/下面，并将alias配置单独提取出来为webpack.resolver.js。

### 配置建议
依次打开Webstorm设置，找到Settings | Languages & Frameworks | JavaScript | Webpack，并将webpack configuration file路径指向webpack.alias.js文件

可选方案可以查看 [Path aliases for imports in WebStorm](https://stackoverflow.com/questions/34943631/path-aliases-for-imports-in-webstorm)

## 源码目录结构（Root Folder Structure）
采用“分而治之”工程理念来管理资源。

为什么要组件化开发？可以看看 [前端工程——基础篇](https://github.com/fouber/blog/issues/10)的“第一件事：组件化开发”部分。

```bash
├── src  # 源码目录
│   ├── assets # 公共静态资源目录
│   │   ├── img # 公共图像资源，通常情况下，UI组件自己管理自己的图像资源
│   │   ├── lib # js模块
│   │   ├── business # 公共业务组件
│   │   └── plugins # vue plugin 用来创建vue component的js调用方式
│   ├── components # 公共ui组件
│   └── pages  # 页面资源目录
│       ├── demo # demo.html (目录名称可修改)
│       │   ├── app.js   # js入口文件entry file (编译脚本中约定的命名，不可修改)
│       │   └── app.html # 与入口文件对应的html模板 (编译脚本中约定的命名，不可修改)
│       └── user # 分模块划分页面例子
│           ├── login
│           │   ├── business.js # 页面独有业务逻辑（命名可以修改）
│           │   ├── app.js   #
│           │   └── app.html #
│           ├── logout
│           │   ├── app.js   #
│           │   └── app.html #
│           ├── page.vue   # 子页面共享page.vue（命名可以修改）
│           └── business.js # 子页面共享业务逻辑（命名可以修改）
├── LICENSE
├── .babelrc          # babel config (es2015 default)
├── .eslintrc.js      # eslint config (eslint-config-vue default)
├── mock/server.js    # 默认端口 2333
├── package.json
├── postcss.config.js # postcss (autoprefixer default)
└── README.md
```

## 编译后的资源目录结构（Dist Folder Structure）
该目录下的资源用于部署或发布

```bash
│  favicon.ico
│  index.html
│
└─assets
    ├─css
    │      index.css
    │
    ├─img
    │      1.f5d47c6.jpg
    │      2.5520ed6.jpg
    │      3.379ed6d.jpg
    │      android.24c4532.gif
    │      ios.2d7a9bb.gif
    │
    └─js
            0.js
            0.js.map
            1.js
            1.js.map
            2.js
            2.js.map
            3.js
            3.js.map
            4.js
            4.js.map
            5.js
            5.js.map
            6.js
            6.js.map
            index.js
            index.js.map
```

For detailed explanation on how things work, checkout the [guide](https://github.com/Plortinus/vue-multiple-pages)

# FAQ
## 无法覆盖组件库的css
在web-dev-server启动后的开发场景中，css的加载顺序是无法保障的。
主要原因是现在打包工具无法跟踪和管理css之间的依赖关系，并且样式是全局性的，
如果编写者没有注意作用域问题，就会带来组件间样式互相影响隐患，
vue为此提供了[style scoped](https://vue-loader-v14.vuejs.org/zh-cn/features/scoped-css.html)的解决方案，更成熟的方案可以参考[css modules](https://vue-loader-v14.vuejs.org/zh-cn/features/css-modules.html)

针对本项目的实际情况，我们可以参照一下优先级顺序来调整我们的css
> css 的优先级：!important > 行内样式 > id > class > tag > * > 继承 > 默认

**举个例子：**

假设有组件如此声明样式
```css
.vux-slider > .vux-indicator {
  bottom: 10px;
}
```

* 限定作用域
```css
.main-box .vux-slider > .vux-indicator {
  button: 5px;
}
```
推荐写法，限定作用于，有scope的概念，减少对全局的影响。

* 重复类选择器
```css
.vux-slider > .vux-indicator.vux-indicator {
  button: 5px;
}
```

* 标注更高优先级
```css
.vux-slider > .vux-indicator {
  bottom: 10px !important;
}
```
*不推荐，这会使css难以修改*

* 使用行内样式
```html
<div class="vux-slider">
  <a class="vux-indicator" style="bottom: 10px"></>
</div>
```

以上三种写法都可以覆盖组件样式，请酌情使用。

问题相关链接：
* [CSS incorrect order](https://github.com/webpack-contrib/sass-loader/issues/318)
* [Feature Request: add a "priority" option to allow defining the order of style blocks](https://github.com/webpack-contrib/style-loader/issues/17)
* [How can I keep the css order in the css file when I use extract-text-webpack-plugin？](https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/200)
