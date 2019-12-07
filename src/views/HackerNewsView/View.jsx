import React from 'react'
import { ConnectedHackerNews } from './component/hacker-news-component'
import { getHackerNewsModule } from './redux/module'
import { DynamicModuleLoader } from 'redux-dynamic-modules-react'
import { hotModuleIsActive } from 'sunny-js/util/HMR'

export default function View () {
  /**
   * strictMode选项用来把add module这个行为放在componentDidMount生命周期事件钩子上
   *
   * 问题场景：
   * React hot load热更新时，第三次render，会触发一个module initialActions中的action不会被再次调用对问题
   * 原因是在strictMode未定义的情况下，热更新过程中会先在DynamicModuleLoader组件
   * 的constructor中先于cleanup（removeModules）之前调用addModules。由于上一次同样的module
   * 未被cleanup，接下来Module Reference Counting（module加载引用计数器）的功能，
   * 则会认为module已被加载，module initialActions系列操作则不会被执行。
   *
   * 正常情况：
   * 重新render时，先前即将被替换的组件componentWillUnmount中的
   * cleanup（removeModules）逻辑应先被调用，然后再调用addModules。
   *
   * 相关代码
   * [strictMode](https://github.com/microsoft/redux-dynamic-modules/pull/72/commits/d7c5f702af5941b445f702e9f3ce71983ad7a3df)
   * [addModules](https://github.com/microsoft/redux-dynamic-modules/blob/master/packages/redux-dynamic-modules-react/src/DynamicModuleLoader.tsx#L90)
   * [cleanup](https://github.com/microsoft/redux-dynamic-modules/blob/master/packages/redux-dynamic-modules-react/src/DynamicModuleLoader.tsx#L187)
   * [Module Reference Counting](https://redux-dynamic-modules.js.org/#/reference/ModuleCounting)
   *
   * react hot load多次调用的最后两次才能访问到新的reduxModule
   * ，这里影响到了DynamicModuleLoader工作
   * 临时解决办法 https://github.com/microsoft/redux-dynamic-modules/issues/53#issuecomment-557649909
   */
  return hotModuleIsActive(
    module,
    <DynamicModuleLoader strictMode={true} modules={[getHackerNewsModule()]}>
      <ConnectedHackerNews />
    </DynamicModuleLoader>,
  )
}
