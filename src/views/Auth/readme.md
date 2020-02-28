# 认证模块

功能：
- 简单认证
- 事件广播能力
- 会发出请求登录事件
- 会监听登录成功事件
- 会监听接口会话超时异常
- 登录成功事件发生后，会回源（回到来源的路由地址）

引用关系：
- 依赖用户登录状态
- 依赖网络请求模块

建议：
- 以路由为最小单位拦截未登录状态的用户访问某些私有路由
- 如果想对路由像后台管理系统那样做精细控制，需要[ACL(Access Control List)](https://github.com/GorillaStack/acl)模块的支持

# 集成ACL
- [ ] ACL权限集中声明
- [ ] ~~收集路由配置中访问权限声明，形成ACL的rules访问规则~~
- [x] 实现route path解析器，返回resource、privilege
- [x] 实现访问当前用户角色接口
- [x] 实现无权访问通知
- [ ] 实现资源创建接口
- [ ] 实现访问规则转换接口
- [ ] 403 无权限页面接入

## 资源和权限是集中声明，还是分散写在路由配置中
- 资源和权限是集中声明
  - 由path解析器决定当前路由的resource、privilege信息
    - 无法提取信息时可以由路由配置作为补充
  - 需要预先定义ACL权限列表
    - 既然会由后端存储，那么分散写到路由配置中就不是个好的选择
- 分散写在路由配置中
  - 由路由嵌套关系决定resource继承关系
  - 由路由决定当前是resource还是privilege
  - 需要遍历树形结构路由信息表来生成resource继承关系 

最终决定
- 考虑未来权限信息由后端存储，可以考虑先集中声明
- path解析器作为确认resource、privilege主要方式，路由配置中携带这两个字段作为覆盖/补充
  - route path可以确定resource继承关系，确定privilege
    - 如果选择自动生成，无论是否为继承关系，resource关键词都不可以重复出现
- 如果想要生成resources所有资源信息，可以遍历所有路由配置，结合path解析器后生成

## ACL权限定义
```js
const permissions = {
  roles: [
    {name: "guest"},
    {name: "member", parent: "guest"},
    {name: "author", parent: "member"},
    {name: "admin"}
  ],
  resources: [
    {name: "post"},
    {name: "comment"}
  ],
  rules: [
    {
      access:     "allow",
      role:       "guest",
      privileges: ["view"],
      resources:  ["post", "comment"]
    }, {
      access:     "allow",
      role:       "member",
      privileges: ["create"],
      resources:  ["comment"]
    }, {
      access:     "allow",
      role:       "author",
      privileges: ["create", "edit", "delete"],
      resources:  ["post"]
    }, {
      access:     "allow",
      role:       "admin",
      privileges: null,
      resources:  null
    }
  ]
};
```
