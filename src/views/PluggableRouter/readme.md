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

```js
/**
 * todo 根据path路径生成嵌套路由
 * path路径已经可以体现URL层级，那么我们可以根据URL层级的特征生成一个树形结构
 * 路由信息表。然后就可以利用层级信息生成嵌套路由。
 */
```

嵌套路由的数据结构可能如下：

```js
let routes = [
  {
    path: '/app',
    Content,
    children: [
      {
        path: '/app/account',
        auth: true,
        Content,
        children: [
          {
            path: '/app/account/profile',
            Content,
          },
          {
            path: '/app/account/deposit',
            Content,
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    Content,
  },
];
```

最终生成的嵌套路由结构可能如下：

```js
let ReactJSX = (
  <>
    <Route path={'/app'} render={props => <Content {...props} />}>
      <AuthRoute path={'/app/account'} render={props => <Content {...props} />}>
        <Route path={'/app/account/profile'} render={props => <Content {...props} />} />
        <Route path={'/app/account/deposit'} render={props => <Content {...props} />} />
      </AuthRoute>
    </Route>
    <Route path={'/login'} render={props => <Content {...props} />} />
  </>
);
```

如果需要跨路由组件进行通信

- 可以考虑使用[React Context](https://reactjs.org/docs/context.html)特性
- 解决一下向下传递 props 的问题 [How to pass props to {this.props.children}](https://stackoverflow.com/questions/32370994/how-to-pass-props-to-this-props-children)
