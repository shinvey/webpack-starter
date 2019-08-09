import React from 'react'
import LoginStore from './LoginStore'
import UserLogin from './UserLogin'

/**
 * __视图容器职责__
 * 建议：
 * * 管理对子组件的依赖关系
 *
 * 可选：
 * * 引用本视图私有样式表，样式可以被自组件覆盖，也可以被子组件使用
 * * 如果需要引入子组件的局部状态对象，请在子组件属性上实例化状态对象
 * * 如果需要为子组件传入全局状态对象，请在子组件属性上调用状态对象的Singleton()方法
 */

export default function View (props) {
  return <UserLogin {...props} loginStore={LoginStore.Singleton()} />
}
