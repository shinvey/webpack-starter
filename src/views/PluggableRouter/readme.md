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

常规嵌套
```jsx harmony
import React from 'react'
export default function View ({ children }) {
  return <ul>
    <li>
      This is Parent View
      {children}
    </li>
  </ul>
}
```

使用自定义布局
```jsx harmony
import React from 'react'
function Layout () {}
export default function View ({ children }) {
  return <Layout>{children}</Layout>
}
```

使用自定义布局，并自由决定子路由在DOM中的位置
```jsx harmony
import React from 'react'
function Layout () {}
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
```

嵌套Switch组件
```jsx harmony
import React from 'react'
import { Switch } from 'react-router-dom'
export default function View ({ children }) {
  return <Switch>{children}</Switch>
}
```

使用PluggableRouter Switch组件，满足全局No Match（404）场景
```jsx harmony
import React from 'react'
import { Switch } from './index'
export function View ({ children }) {
  // 如果没有匹配到URL，则会默认跳转至/404
  return <Switch>{children}</Switch>
}
export function View ({ children }) {
  // 使用noMatch属性，修改默认跳转行为，比如跳转至首页
  return <Switch noMatch={'/home'}>{children}</Switch>
}
```

向子视图传递参数。也可以考虑使用React Context特性传参
```jsx harmony
import React from 'react'
function Layout () {}
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
```

不同路由组件共享同一个视图。可以通过两种方式来声明。实现类似视图多重继承。
- 第一种：使用route path以数组值类型，
```jsx harmony
export const route = {
  key: 'son',
  name: '儿子',
  path: ['/parent/son', '/parent/brother/son'],
}
export const Content = loadable({
  loader: () => import(/* webpackChunkName: "son" */'./View'),
  loading: Loading
})
// 注意：path和nest（用来重写path继承规则）属性同时使用时，会有如下情况需要注意
export const route = {
  key: 'son',
  name: '儿子',
  path: ['/parent/son', '/parent/brother/son'],
  nest: '/parent/son/index', // 仅仅只影响route.path[0]
  // nest: ['/parent/son/index'] // 等同于以上写法
}
export const route = {
  key: 'son',
  name: '儿子',
  path: ['/parent/son', '/parent/brother/son'],
  // 如果nest也是数组，就比较容易理解。nest[0]作用于path[0]，往后以此类推
  nest: ['/parent/son/index', '/parent/brother/son/index']
}
```
- 第二种：使用import()引用同一个视图View
```jsx harmony
import React from 'react'
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

### 改写视图嵌套关系的应对方法

通常默认规则已经能够解决大部分问题，而下列路由规则的之间的关系则很微妙

#### 场景一：两个兄弟路由的path前缀是相同的，UI视觉上也不是嵌套关系
```jsx harmony
export const route = {
  key: 'parent',
  name: '父亲',
  path: '/parent',
}
export const route = {
  key: 'brother',
  name: '兄弟',
  path: '/parent/:id',
  // 提高路由解析优先级
  exact: true,
}
```

#### 场景二：为有父子嵌套关系的视图，单独创建独立的落地页
```jsx harmony
export const route = {
  key: 'parent',
  name: '父亲',
  path: '/parent',
}
export const route = {
  key: 'son',
  name: '儿子',
  path: '/parent/son', // 与/parent是嵌套关系
}
export const route = {
  key: 'parentHome',
  name: '父亲的落地页',
  // parentHome虽然与parent使用同一个path，但它却是独立视图，
  // 跟parent没有继承关系
  path: '/parent',
  // 因为path跟parent相同，需要使用精确匹配属性
  exact: true,
}
```

如果你想为parent的创建一个有嵌套关系的首页，可以使用常规办法
```jsx harmony
export const route = {
  key: 'parentHome',
  name: '父亲的落地页',
  path: '/parent/landing', // path路径中包含了嵌套关系
}
```
或者在不改动path的情况下，修改嵌套属性，重定义嵌套关系
```jsx harmony
export const route = {
  key: 'parentHome',
  name: '父亲的落地页',
  path: '/parent', // 跟parent使用相同path
  nest: '/parent/index', // 表示该视图从parent继承
  exact: true, // 因为path跟parent相同，需要使用精确匹配属性
}
```

#### 场景三：父级路由和其他子级路由有嵌套关系，但其中一个路由对应的视图在UI视觉上没有嵌套关系
```jsx harmony
export const route = {
  key: 'parent',
  name: '父亲',
  path: '/parent',
}
export const route = {
  key: 'child',
  name: '孩子',
  path: '/parent/child', // 跟/parent有嵌套关系
}
export const route = {
  key: 'brother',
  name: '兄弟',
  path: '/parent/brother',
  // brother视图通过改写nest嵌套属性，来拒绝被parent视图嵌套，变成parent的兄弟节点
  // nest属性会提高路由解析优先级
  nest: '/parentBrother',
}
```
# 如何实现breadcrumbs面包屑组件？
两种用例
- 根据视图嵌套关系自动生成
  - 遍历树形结构的路由配置
- 使用者自定义一个路由配置信息的一维数组
  - 使用route key组成数组
  - 使用route组成数组

可定制：
- 自定义面包屑渲染方式
  - 默认使用route name
  - 使用函数接受路由参数，自定义面包屑输出内容

相关讨论：
- [Breadcrumbs Example in V4 Documentation](https://github.com/ReactTraining/react-router/issues/4556)
