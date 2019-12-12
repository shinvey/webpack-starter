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

可以利用路径信息来辅助分析Route组件的嵌套关系，这个路径信息可以来自Route path，也可以来自
视图所在目录。为了让默认嵌套关系可以被修改，当然也可以手动指定一个类似路径的属性，用来修改嵌套关系。

## 生成嵌套路由的过程
1. 扫描所有视图入口，生成[一维数组路由信息表](./nestingRoutes/defArrRoutes.js)，包含视图所在目录信息
2. 根据视图入口所在目录信息分析嵌套关系，生成[嵌套路由信息表](./nestingRoutes/defTreeRoutes.js)
3. 使用递归将嵌套路由信息表转换为[嵌套路由组件](./nestingRoutes/treeRoutesJSX.jsx)

## 嵌套路由需要解决4个问题

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
2. 处理path中的动态参数，处理数组类型的path
3. 要求`UI视觉`和`path`的嵌套关系是一致的

选择directory需要面对的问题
1. 要求`UI视觉`、`path`、`目录`的嵌套关系是一致的

共同的问题
1. /parent/child, /parent/child/grandchild指向同一个视图，路径之间是别名关系
    1. 打破了嵌套path规则
        1. 使用path数组方式声明
2. /parent/child, /parent/child/grandchild，URL前缀一样，但指向不同视图，且UI界面视觉上不是嵌套关系
    1. 打破了嵌套path规则
        1. 如果父级路由没有任何嵌套关系，可以声明Route exact属性
        2. 如果父级路由跟其他视图有嵌套关系，是个死结，则当前视图，需要脱离嵌套关系
            - 对于path的解法，需要声明额外路由配置属性来脱离嵌套关系
            - 对于directory的解法，在目录上可以脱离嵌套关系
            - path + directory脱离嵌套关系后，需要共同面对排序问题
                - 兄弟路由，搭配Switch组件切换，如果path前缀相同，需要考虑两个Route排列先后顺序问题
                    - [兄弟路由排序问题的代码例子](https://stackblitz.com/edit/react-router-hash)

path，directory分析嵌套关系方案的共同点
1. 要求`Route path`、`UI视觉`的嵌套关系是一致的

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

// 使用自定义布局，并自由决定子路由在DOM中的位置
export default function View ({ childrenRoutes }) {
  /**
   * 如果你有三个视图，他们route.key分别是leftSidebar、rightSidebar、myContent
   * 你可以通过访问childrenRoutes对象来决定它们在你布局中的位置
   */
  return <Layout>
    <div className="left sidebar">{childrenRoutes.leftSidebar}</div>
    {childrenRoutes.myContent}
    <div className="right sidebar">{childrenRoutes.rightSidebar}</div>
  </Layout>
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
```

特殊问题的应对办法
```jsx harmony
/**
* 改写视图的嵌套关系应对方法
* 通常默认规则已经能够解决大部分问题，如果一定需要改写默认嵌套规则，需要考虑两个场景
*/
// 场景一：两个兄弟路由的path前缀是相同的，UI视觉上也不是嵌套关系
export const route = {
  key: 'parent',
  name: '父亲',
  path: '/parent',
  // 如果遇到Switch解析优先级问题，可以尝试使用exact属性
  // exact: true,
}
export const route = {
  key: 'brother',
  name: '兄弟',
  path: '/parent/:id',
}
// 场景二：父级路由和其他子视图有嵌套关系，但其中一个视图在UI视觉上没有嵌套关系
export const route = {
  key: 'parent',
  name: '父亲',
  path: '/parent',
  // sort: 2
}
export const route = {
  key: 'brother',
  name: '兄弟',
  path: '/parent/brother',
  // brother视图通过改写嵌套属性，来拒绝被parent视图嵌套，变成parent的兄弟节点
  nest: '/parentBrother',
  // 如果搭配了Switch，且有排序问题时，可以声明排序规则
  // sort: 1
}
```
