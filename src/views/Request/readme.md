# 网络请求模块

功能：
- 支持事件广播
- 支持定义业务异常code、message
- 支持自定义请求header
- 支持promise、observable两种类型的api
- 已经内置支持取消和重拾请求

引用关系：
- 依赖Auth模块

# 使用 RxJS 实现交互可定制的请求重试和取消

- 案例 1：[使用重试和取消按钮的事件来控制请求重试和取消][retrywhen-onclick]
- 案例 2：[使用暴露 ajax$.retry(), ajax$.cancel()两个方法来实现请求重试和取消][retrywhen-subject]

[retrywhen-onclick]: https://stackblitz.com/edit/rxjs-retrywhen-onclick
[retrywhen-subject]: https://stackblitz.com/edit/rxjs-retrywhen-subject
