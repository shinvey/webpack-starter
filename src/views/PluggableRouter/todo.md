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
- [x] ~~如果路由path是数组类型取length最长的那个~~由数组排序决定会更有可控性，默认取第一个数组元素。
- [x] 支持path/nest为数组类型，在arrRoutes一维数组中做预处理会更简单，还可以顺便解决一对多的继承问题。

