# 新旧架构桥接模块
该解决方案解决新旧架构过度时期，redux store状态共享的问题

## 问题列表
1. redux store如何做到两个应用互通
2. 两个应用如何实现嫁接？

## 主要思路
### redux store如何做到两个应用互通
两个应用同时使用同一个store实例
- 通过装饰者模式，设计mapToNewAction装饰器，装饰reducer function达到单向同步目的
- 使用addActionTranslator，允许添加一个action翻译器，实现旧reducer到新reducer同步
- 设计一个dispatch中间件，链接action翻译逻辑，发送两个dispatch，实现双向同步目的

### 两个应用如何实现嫁接？
创建一个app bridge react根节点的组件，注入到旧应用的react router结点下，
创建一个共享redux store
