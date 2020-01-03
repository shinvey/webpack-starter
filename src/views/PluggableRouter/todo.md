- [ ] 抽象视图接口成route配置文件
    - 如将`*View/index.*`简化成`*/route.*`

```js
// 路由配置
const route = {
  path: '',
  component: import(''),
}
```

- [x] 处理路由path [sensitive](https://reacttraining.com/react-router/web/api/Route/sensitive-bool)，大小写敏感问题
- [ ] 如果路由path是数组类型取length最长的那个
- [ ] 支持path/nest为数组类型，在arrRoutes一维数组中做预处理会更简单
