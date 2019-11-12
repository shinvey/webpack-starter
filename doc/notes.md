# webpack-spa-react

> 项目描述

# 技术栈

## 命令行工具
1. webpack(模块打包)
1. npm/yarn/pnpm(包管理)

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
    1. [Lodash-es vs individual Lodash utilities: Size comparison](https://itnext.io/lodash-es-vs-individual-lodash-utilities-size-comparison-676f14b07568)
    2. [lodash替代方案](https://github.com/angus-c/just)

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
```bash
npm install sass-loader node-sass
```
## css module支持或组件级样式书写方案
1. css-loader
1. [styled-component](https://www.styled-components.com/)
1. [linaria](https://github.com/callstack/linaria)
  1. [How does SC compare to Linaria?](https://github.com/styled-components/styled-components/issues/2377)
  2. [Static CSS Extraction](https://github.com/styled-components/styled-components/issues/1018)
1. [styled-jsx](https://github.com/zeit/styled-jsx)

## css主题书写建议
如果真要配合css module一块使用，嵌套问题完全取决于，同一个样式表中不同作用域是否有重名css选择器
不使用css module的情况下，至少要有一个以组件节点作为父级作用域的css selector来确立一个scope，来避免子节点样式可能对外部产生影响

- 基于css module的主题解决方案
```scss
// 基本样式 / 不同主题共享样式 / bare bone style
.component_scope {
  .child {
    .grandchild {}
  }
  .kid {
    .grandchild {}
  }
  .child {
    .nested_child {}
  }
}
// 白天
:global([data-theme=light]) {
  // 因为子元素classname重名，需要声明父类来区别作用域
  .child {
    .grandchild {}
  }
  .kid {
    .grandchild {}
  }
  // 无需嵌套.component_scope，css module会帮助隔离外部重名classname
  .nested_child {}
}
// 黑夜
:global([data-theme=dark]) {
  .child {
    .grandchild {}
  }
  .kid {
    .grandchild {}
  }
  .nested_child {}
}
```

- 纯css主题解决方案
```scss
// 基本样式 / 不同主题共享样式 / bare bone style
.component_scope {
  .child {
    .nested_child {}
  }
}
// 白天
[data-theme=light] {
  // 纯css方案，至少需要声明一个组件级别作用域
  .component_scope {
    // 无重名classname，无需嵌套
    .nested_child {}
  }
}
// 黑夜
[data-theme=dark] {
  .component_scope {
    .nested_child {}
  }
}
```

## postcss支持
1. postcss preset env
1. PostCSS Utility Library
    1. postcss-utilities
## LostGrid栅格系统支持
```bash
npm i lost
npm install stylelint-config-lost --save-dev
```

## 添加react支持

1. react css modules [babel-plugin-react-css-modules](https://github.com/gajus/babel-plugin-react-css-modules)
2. react-ideal-image
    * I need React component to asynchronously load images, which will adapt based on network, which will allow a user to control, which image to load.
## 编码规范
__js代码书写规范 eslint__
```bash
npm i -D eslint
```
__样式书写规范 stylelint__
```bash
npm i -D stylelint stylelint-config-standard
# 支持scss语法
npm i stylelint-scss -D
```
stylelint plugin中 暂无sass语法的支持
__样式属性排列顺序__
1. [stylelint-order](https://github.com/hudochenkov/stylelint-order)

__持续保持书写规范 prettier__

1. [Integrating with Linters](https://prettier.io/docs/en/integrating-with-linters.html)
1. [How to integrate Prettier with ESLint and stylelint](https://www.freecodecamp.org/news/integrating-prettier-with-eslint-and-stylelint-99e74fede33f/)

### 编译时检查
缺点是影响编译速度
### 提交时检查
优点是不影响编译速度
[lint-staged](https://github.com/okonet/lint-staged)
```bash
npx mrm lint-staged
```
### 配置IDE支持
__vs code__

__WebStorm__
stylelint没有像eslint那样在右键快捷菜单中有Fix Problems的选项
[webstorm stylelint fix](https://stackoverflow.com/questions/54304313/stylelint-fix-in-webstorm)

## 开发调试支持
[x] js sourcemap
* sourcemap如果不能被chrome浏览器通过workspace功能映射到源码文件，说明代码中有中文

[x] css sourcemap

[x] webpack dev server
```bash
npm install webpack-dev-server --save-dev
```

## 环境变量支持
[x] webpack define plugin

对比以下两个plugin的使用场景
extract-css-chunks-webpack-plugin, 对css HMR支持更好
mini-css-extract-plugin，对css HMR没有想象中那么好

# 兼容性处理
[ ] modernizer, 是浏览器特性检测库，可以借用addTest来支持设备检测区分android和ios
增加命令行编译配置文件`modernizr-config.json`
```json
{
  "options": [
    "addTest"
  ],
  "feature-detects": []
}
```
在`package.json`增加npm scripts
```json
{
  "scripts": {
      "build:modernizr": "modernizr --config modernizr-config.json --dest src/utils/modernizr.custom.js",
      "build:modernizr:uglify": "modernizr --config modernizr-config.json --dest src/utils/modernizr.custom.min.js --uglify"
  }
}
```
编译输出custom build到src/utils/modernizr.custom.js
在`.eslintrc.js`中增加全局变量Modernizr
```js
module.exports = {
  globals: {
    'Modernizr': 'readonly'
  }
}
```
在`.eslintignore`增加custom build忽略规则
```text
# 忽略custom build
src/utils/*.custom.*
```

Modernizr设备检测用例
```js
import('../../utils/modernizr.custom').then(() => {
  // see https://modernizr.com/docs#modernizr-addtest
  Modernizr.addTest({
    iOS: /iPhone/i.test(navigator.userAgent),
    Android: /Android/i.test(navigator.userAgent)
  })
})
```
```scss
// 配合Modernizr的addTest API增加设备检测，并把检测结果放在html元素的class属性中
.android {
  .box {
    color: red;
  }
}

.ios {
  .box {
    color: green;
  }
}
```

[ ] 设备检测
mobile-detect.js https://github.com/hgoebl/mobile-detect.js
current-device https://github.com/matthewhudson/current-device
device.js https://github.com/binnng/device.js

[ ] [使用vw实现移动端适配](https://juejin.im/entry/5aa09c3351882555602077ca)
  1. [postcss-adaptive](https://github.com/songsiqi/postcss-adaptive)
[ ] [使用基于rem的可伸缩布局方案](https://github.com/shinvey/rem-flexible)
  2. [postcss-pxtorem](https://github.com/cuth/postcss-pxtorem)

* [x] css autoprefix, postcss-preset-env已实现
* [x] browserlist
* [x] polyfill支持, polyfill service。改方案会损失一定的开发体验，基于此问题可以尝试如下方案
  * [polyfill-service-webpack](https://github.com/jussi-kalliokoski/polyfill-service-webpack)
  * [polyfill-service-url-builder](https://github.com/Financial-Times/polyfill-service-url-builder)

__兼容性检查__
如果你不打算polyfill你的项目，你或许要开启eslint-plugin-compat对浏览器兼容性的检查
https://github.com/amilajack/eslint-plugin-compat
__polyfill service__

## 可选支持webp
[x] 考虑为支持webp的设备使用输出的webp资源

__运行时支持__
配合Moodernizr addTest API，在html中增加webp特性检测。然后在css中书写webp资源引用

__资源重定向支持__
编译时输出两套资源，一个传统jpg，png，一个webp，判断客户端是否支持，然后采用重定向方式
* 客户端，可以编译出两套代码，一套传统，一套指向webp
* 服务器端或cdn开启webp支持，实现的技术是采用[uri rewrite](https://www.tezify.com/how-to/using_webp_images/)技术
  1. [如何通过 WebP 兼容减少图片资源大小](https://www.cnblogs.com/upyun/p/6898791.html)

备注：浏览器通过html页面携带支持webp的accept头，告诉web server支持webp，接下来具体请求图片时就不用携带了

__实践__

首先caniuse.com了解webp的浏览器支持程度，然后为支持的设备提供webp图像优化。
* [webp图片实践之路](https://www.cnblogs.com/season-huang/p/5804884.html)

web server层的优化方案实现思路
1. 根据客户端请求头accept中文件mime类型列表判断是否支持webp
2. 如果支持，判断webp文件是否存在
3. 存在则进行uri rewrite到webp
4. 不存在生成webp文件，生成成功，执行第3步
5. 生成失败，返回源文件

nginx配置相关文章
* [webp支持完整nginx配置用例](https://github.com/uhop/grunt-tight-sprite/wiki/Recipe:-serve-WebP-with-nginx-conditionally)
* [webp支持关键配置用例](https://www.keycdn.com/support/optimus/configuration-to-deliver-webp)
* [集成命令行工具来支持webp，实现webp自动生成和image url重写](https://typcn.com/legacy/blog/posts/switch-to-webp.html)

前端工程输出webp
1. 使用命令行工具进行批量转换
    1. gulp + gulp-webp + gulp-cache

如何将图像转换为webp格式？

[How do I convert my images to WebP?](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/automating-image-optimization/#how-do-i-convert-to-webp)
```bash
# 项目中使用gulp任务来对src目录内的图像进行批量转换
gulp webp
```

视觉设计团队输出webp
1. sketch设计软件在导出切图时增加webp格式的图像导出

__如何在项目中使用webp？__

[Using WebP Images](https://css-tricks.com/using-webp-images/)

__如果对现有项目进行支持webp改造？__

[webp-in-css](https://github.com/ai/webp-in-css) PostCSS plugin and tiny JS script (128 bytes) to use WebP in CSS background

编译时与运行时相结合解决现有项目对webp的支持：
1. 编译时处理css，增加webp类样式，意图通过webp class 类名样式来支持加载webp
2. 运行时判断浏览器是否支持webp，在DOM根节点增加webp类名，意图为辅助与配合webp类样式

You add `require('webp-in-css')` to your JS bundle and write CSS like:

```css
.logo {
  width: 30px;
  height: 30px;
  background: url(/logo.png);
}
```

The script will set `webp` or `no-webp` class on `<body>`
and PostCSS plugin will generates:

```css
.logo {
  width: 30px;
  height: 30px;
}
body.webp .logo {
  background: url(/logo.webp);
}
body.no-webp .logo {
  background: url(/logo.png);
}
```

## caniuse tools
1. [doiuse](http://doiuse.herokuapp.com/)
2. [stylelint-no-unsupported-browser-features](https://github.com/ismay/stylelint-no-unsupported-browser-features)

# 工程优化
## 基本静态资源优化
[x] HTML压缩

__CSS压缩__
[x] css minimizer
  1. cssnano
  2. optimize-css-assets-webpack-plugin
[ ] Purgecss是根据内容（html、js）来分析css是否被使用，来实施类似tree shaking的优化

__JS压缩__

__图像优化___
```bash
npm i url-loader file-loader
```
url-loader 内嵌小于8k的小图像
file-loader 当图像大于8k时，将图像资源输出到制定目录中

你或许考虑使用[imagemin-webpack](https://github.com/itgalaxy/imagemin-webpack)，来做图像优化
Images can be optimized in two modes:
* Lossless (without loss of quality).
* Lossy (with loss of quality).
```bash
npm install imagemin-webpack
# Recommended basic imagemin plugins for lossless optimization
npm install imagemin-gifsicle imagemin-jpegtran imagemin-optipng imagemin-svgo
# Recommended basic imagemin plugins for lossy optimization
npm install imagemin-gifsicle imagemin-mozjpeg imagemin-pngquant imagemin-svgo
```

在移动Web使用responsive images可以根据用户屏幕尺寸下载合适尺寸的图像
使用responsive-loader
```bash
npm install responsive-loader sharp
```

为responsive-loader做缓存
```bash
npm i cache-loader
```

从一组srcset中，浏览器如何选择合适的src？
[With srcset, the browser does the work of figuring out which image is best](https://css-tricks.com/responsive-images-youre-just-changing-resolutions-use-srcset/#article-header-id-0)

在css中使用responsive images
```scss
/* Responsive Images */
// postcss会将如下写法转义成兼容性代码
// postcss-preset-env插件image-set()文档 https://preset-env.cssdb.org/features#image-set-function
// image-set()具体转义内容请查阅 https://github.com/jonathantneal/postcss-image-set-function
.img {
  background: image-set(
      url(../images/icon_red_packet_small.png) 1x,
      url(../images/icon_red_packet_small@2x.png) 2x,
      url(../images/icon_red_packet_small@3x.png) 3x
  ) no-repeat center;
}
```

__缓存清理__
* clean-webpack-plugin

__文件目录管理__
* filemanager-webpack-plugin

删除目录

创建zip包

## 首屏加载性能优化
[ ] 使用split chunk配置去配合script-ext和style-ext分离出critical resource
__骨架HTML(Skeleton HTML)__
index/skeleton.html

__关键CSS__
naming convention: xxx.critical.css
Enhances html-webpack-plugin functionality with different deployment options for your scripts including 'async', 'preload', 'prefetch', 'defer', 'module', custom attributes, and inlining.

__关键js__
nameing convention: xxx.critical.js
Enhances html-webpack-plugin functionality by enabling internal ('in-line') styles.

__内嵌js/css__
style-ext-html-webpack-plugin和script-ext-html-webpack-plugin对sourcemap的问题没有处理好
考虑使用html-webpack-inline-source-plugin@beta替代，但是该插件不完美的地方是，内嵌的资源，没有清理，依然存在资源输出目录
```bash
# https://www.npmjs.com/package/html-webpack-inline-source-plugin/v/1.0.0-beta.2
npm i html-webpack-inline-source-plugin@beta
```

__调整资源加载优先级__
[style-ext-html-webpack-plugin](https://github.com/numical/style-ext-html-webpack-plugin)
[script-ext-html-webpack-plugin](https://github.com/numical/script-ext-html-webpack-plugin)

__代码分离和长效缓存__
eslint支持import()
```bash
npm install babel-eslint
```
.eslintrc.js
```js
module.exports = {
  parser: "babel-eslint",
};
```
babel支持import()
```bash
npm i @babel/plugin-syntax-dynamic-import
```

[x] 响应式图片
  1. img, srcset
  2. css, image-set()

[x] 懒加载解决方案
  1. [可视区域懒加载组件](https://github.com/amfe/amfe-appear)
  2. [lazyload](https://github.com/verlok/lazyload)

[x] 预加载
[prefech/preload resource hint](https://webpack.js.org/guides/code-splitting/#prefetchingpreloading-modules)

## 工程编译性能优化
提升编译性能

## 工程编译输出资源大小监控
bundle大小监控

# 创建项目开发模板

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
```bash
npm run build:profile
```

## WebStorm无法对import中的别名路径进行解析
WebStorm默认寻找项目根路径下的webpack.config.js中resolve.alias配置，但是当前工程配置相对复杂，
已将他们全部移动build/下面，并将alias配置单独提取出来为webpack.resolver.js。

### 配置建议
依次打开WebStorm设置，找到Settings | Languages & Frameworks | JavaScript | Webpack，并将webpack configuration file路径指向webpack.alias.js文件

可选方案可以查看 [Path aliases for imports in WebStorm](https://stackoverflow.com/questions/34943631/path-aliases-for-imports-in-webstorm)

## 源码目录结构（Root Folder Structure）
采用“分而治之”工程理念来管理资源。

为什么要组件化开发？可以看看 [前端工程——基础篇](https://github.com/fouber/blog/issues/10)的“第一件事：组件化开发”部分。

```text
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

```text
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
推荐写法，限定作用于，有scope/namespace/contextual的概念，减少对全局的影响。

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
  <a class="vux-indicator" style="bottom: 10px"></a>
</div>
```

以上三种写法都可以覆盖组件样式，请酌情使用。

问题相关链接：
* [CSS Specificity](https://www.w3schools.com/css/css_specificity.asp)
* [CSS incorrect order](https://github.com/webpack-contrib/sass-loader/issues/318)
* [Feature Request: add a "priority" option to allow defining the order of style blocks](https://github.com/webpack-contrib/style-loader/issues/17)
* [How can I keep the css order in the css file when I use extract-text-webpack-plugin？](https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/200)
