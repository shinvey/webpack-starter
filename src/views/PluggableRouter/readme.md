# 父层组件重复调用的情况下，嵌套 Route 组件也会跟着重复调用，可以怎么做来避免？

在使用以下方式创建组件后

1. class 组件使用 PureComponent
2. 函数组件使用 memo
   直接使用 View.js 默认 export 作为<Route>的子组件，因旧应用的上层组件连续发送 4+次
   以上的 dispatch，收到牵连产生连续调用 4+次以上，经过检查主要是 Route 组件传进来的 match
   属性每次都会重新创建，这个是 React Router 设计的默认行为，详情可以查看[React Router 相关逻辑](#react-router-match)

应对建议：

1. 在 memo 第二个参数或 shouldComponentUpdate 手动对比变化，查看[Tim Dorr 推荐做法](https://github.com/ReactTraining/react-router/issues/6144#issuecomment-388238115)
2. 代码从 View.js 默认 export 中分离出去
3. 从根源上层组件节点，避免重复调用
   避免 connect 全局 state，只使用和组件相关 state。[redux 对全局 state 使用建议](https://react-redux.js.org/api/connect#example-usage)
   > Don’t do this! It kills any performance optimizations because TodoApp will rerender after every state change. It’s better to have more granular connect() on several components in your view hierarchy that each only listen to a relevant slice of the state.

React Router 相关逻辑<a name="react-router-match"></a>

- [switch 输出 match 属性的逻辑](https://github.com/ReactTraining/react-router/blob/ea44618e68f6a112e48404b2ea0da3e207daf4f0/packages/react-router/modules/Switch.js#L33)
- [matchPath 函数定义](https://github.com/ReactTraining/react-router/blob/29e02a301a6d2f73f6c009d973f87e004c83bea4/packages/react-router/modules/matchPath.js#L28)

只要有 path 路径信息，match 就会重新创建。matchPath 函数每次都会返回新的 Object。
使用 withRouter 的场景，path 可能为空，就会直接使用上一次的计算的结果。

# 如何让 PluggableRouter 支持嵌套路由？<a name="nested-routes"></a>

当初考虑使用Route path来体现路由层级，后在测试可用性的过程中，发现Route path是动态路径，
规则可以简单或复杂，所以改用嵌套文件夹来体现路由嵌套层级，那么我们可以根据嵌套文件夹的特征
生成一个树形结构路由信息表。然后就可以利用树形结构路由信息表生成嵌套路由。

## 生成嵌套路由的过程
1. 扫描所有视图入口，生成[一维数组路由信息表](./nestingRoutes/defArrRoutes.js)，包含视图所在目录信息
2. 根据视图入口所在目录信息分析嵌套关系，生成[嵌套路由信息表](./nestingRoutes/defTreeRoutes.js)
3. 使用递归将嵌套路由信息表转换为[嵌套路由组件](./nestingRoutes/treeRoutesJSX.jsx)

## 嵌套路由需要解决三个问题

必须：

1. 父组件可以决定props.children摆放位置，实现Layout布局视图

可选：

2. 因嵌套Route不会主动向下传递props，需要支持父组件向子组件传递props
3. 父级组件可以选择是否嵌套Switch
4. 不同业务模块的嵌套路由可以共享视图

## 嵌套路由组件中，父子组件或跨组件通信可以选择

- 可以考虑使用[React Context](https://reactjs.org/docs/context.html)特性
- 了解如何向下传递 props 的问题 [How to pass props to {this.props.children}](https://stackoverflow.com/questions/32370994/how-to-pass-props-to-this-props-children)

## 分析Route间嵌套关系，选择Route path，还是directory？

选择Route path需要面对的问题
1. /, *, /:variable, 正则表达式等几种路径无法体现嵌套关系
    1. 无法确认嵌套关系
        1. 避免这类路径有嵌套关系
        2. 视为没有嵌套关系的独立视图
    2. 配合Switch组件切换，需要考虑两个Route排列先后顺序问题
        1. 路由配置需要声明排序属性，解决排序问题
2. /parent/child, /parent/child/grandchild指向同一个视图，路径之间是别名关系
    1. 打破了嵌套path规则
        1. 使用path数组方式声明
        2. 如果父级路由没有任何嵌套关系，可以声明Route exact属性
3. /parent/child, /parent/child/grandchild指向不同视图，且UI界面视觉上不是嵌套关系
    1. 打破了嵌套path规则
    2. 配合Switch组件切换，需要考虑两个Route排列先后顺序问题

选择directory需要面对的问题
1. 要求UI视觉和目录的嵌套关系是一致的

选择directory的原因
1. 目录变化的几率比Route path更小，面对的问题最少
2. UI视觉和目录的嵌套关系一致，符合常规逻辑思维习惯
3. 不需要设计新的路由配置信息
4. 除了常规树遍历，代码无需为Route path变化额外增加特殊处理和逻辑判断

如果一定要依赖Route path分析嵌套关系，有可能会限定path使用规则，或增加新的路由配置属性

## 嵌套路由的使用案例
代码中的children均代表子一级路由组件数组，可以被react直接渲染
```jsx harmony
// 常规嵌套
import React from 'react'
export default function View ({ children }) {
  return <ul>
    <li>
      This is Parent View
      {children}
    </li>
  </ul>
}

// 使用自定义布局
function Layout () {}
export default function View ({ children }) {
  return <Layout>{children}</Layout>
}

// 嵌套Switch组件
import { Switch } from 'react-router-dom'
export default function View ({ children }) {
  return <Layout><Switch>{children}</Switch></Layout>
}

// 向子视图传递参数。也可以考虑使用React Context特性传参
export default function View ({ children }) {
  return <Layout>{Children.map(
    children,
    child => cloneElement(
      child,
      // 子视图可以通过props接受该参数
      { hello: 'hello from Parent' }
    )
  )}</Layout>
}

// 不同路由组件共享同一个视图
// 第一个视图接口 ParentView/SonView/index.js
export const route = {
  key: 'son',
  name: '儿子',
  path: '/parent/son',
}
export const Content = loadable({
  loader: () => import(/* webpackChunkName: "son" */'./View'),
  loading: Loading
})
// 第二个视图接口 ParentView/BrotherView/SonView/index.js
export const route = {
  key: 'brotherSon',
  name: '兄弟的儿子',
  path: '/parent/brother/son',
}
export const Content = loadable({
  // 直接引用ParentView/SonView/View.jsx
  loader: () => import('../../SonView/View.jsx'),
  loading: Loading
})
// 如果需要组件级更细致的控制，将共享视图抽象成组件会是更合适的解决方案

// 改写视图的嵌套关系
export const route = {
  key: 'brother',
  name: '兄弟',
  path: '/parent/brother',
  // brother视图通过改写目录属性，来拒绝被parent视图嵌套
  dir: 'parent-brother'
}
```
