# 使用 VSCode 需要安装的插件

1. 安装[Settings Sync](https://marketplace.visualstudio.com/items?itemName=Shan.code-settings-sync)
2. 进入[Settings Sync欢迎页](./doc/img/settings-sync-enter-gist-id.png)后，使用公用Gist ID 1442bbd235249fbc76b2b09e7b21994b 同步配置

# 安装

> 在项目根目录执行

```bash
# 加速 yarn/npm install过程
# npm、yarn、pnpm测评 https://pnpm.js.org/en/benchmark
npm i -g pnpm
pnpm i
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

> 构建正式环境包

```bash
npm run build:production
```

> 如果你需要单独启动一个模拟线上nginx的环境，可以这样

```bash
# 这个npm script一般用来验证dist目录下的资源是否按预期正确输出
npm run serve:spa
```

# Bundle 分析
```bash
npn run build:production:analyze
```
