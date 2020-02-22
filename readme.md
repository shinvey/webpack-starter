# 使用 VSCode 需要安装的插件 （可选）

1. 安装[Settings Sync](https://marketplace.visualstudio.com/items?itemName=Shan.code-settings-sync)
2. 进入[Settings Sync欢迎页](./doc/img/settings-sync-enter-gist-id.png)后，使用公用Gist ID 1442bbd235249fbc76b2b09e7b21994b 同步配置

# 安装

> 在项目根目录执行

```bash
# 加速 yarn/npm install过程
# npm、yarn、pnpm测评 https://pnpm.js.org/en/benchmark
npm i -g pnpm
pnpm i
# 如果你的webstorm对typescript的类型检索支持的不太好还是用回yarn吧
yarn install
```

Note： Mac OS 下有可能出现的异常'vips/vips8' file not found
```bash
# 如果pnpm i过程中遇到sharp安装抛出的异常fatal error: 'vips/vips8' file not found
# 可以使用brew安装依赖vips图像处理库
brew install vips
# 然后再继续执行
pnpm i --force
```

> 在开发环境执行

```bash
npm run start:spa
```

> 测试环境构建

```bash
npm run build:staging:clean
```

> 预发/UAT环境构建

```bash
npm run build:production:clean
```

> 正式环境构建

```bash
npm run build:production:clean
```

> 如果你需要单独启动一个模拟线上nginx的环境，可以这样

```bash
# 这个npm script一般用来验证dist目录下的资源是否按预期正确输出
npm run serve:spa
```

# 可伸缩布局（scalable interface）
在项目开始之前，你需要确认是否启用“可伸缩布局”方案，并设定好相关参数
定位到[postcss.config.js](./postcss.config.js)
```js
module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      // viewportWidth: 320, // 视窗宽度，默认值320px
      // 定义忽略的class类名，支持定义字符串关键词或正则表达式
      selectorBlackList: [
        'ignore' // will match .ignore, .ignore-class, .class-ignore
      ],
    }
  }
}
```

# 设置好项目要支持的浏览器版本
定位到[package.json](./package.json)，根据实际情况，修改配置
```json
{
  "browserslist": [
    "current node"
  ]
}
```

# 集成SonarLint
VSCode
 - 安装[SonarLint](https://www.sonarlint.org/vscode/)插件

WebStorm
- 安装[SonarLint](https://www.sonarlint.org/intellij/)插件

# Bundle 分析
```bash
npn run build:production:analyze
```
