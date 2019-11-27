# 动态添加[Redux dynamic module][RDM]，且跟随组件生命周期而挂载或卸载
需要用到[DynamicModuleLoader](https://redux-dynamic-modules.js.org/#/reference/DynamicModuleLoader)组件
完成此用例。

以下代码中为什么会加上module.hot条件判断？
查看此链接来了解解决了什么问题 https://github.com/shinvey/webpack-starter/blob/feature/react-stack-spa-redux/src/views/HackerNewsView/View.jsx#L7

```javascript
import React from 'react'
import { ConnectedHackerNews } from './component/hacker-news-component'
import { getHackerNewsModule } from './redux/module'
import { DynamicModuleLoader } from 'redux-dynamic-modules-react'

export default function View () {
  return module.hot && module.hot.active && <DynamicModuleLoader strictMode={true} modules={[getHackerNewsModule()]}>
    <ConnectedHackerNews />
  </DynamicModuleLoader>
}
````

# 动态添加[Redux dynamic module][RDM]，且常驻内存，供组件挂载时再次使用
有时你可能需要使用redux这个采用内存存储的全局状态管理工具来添加一些reducer，就算组件被卸载后，依然可以被调用。
reducer产生的state，也依然在store中保留。

## 场景1：一些组件只需要请求一次接口，再次访问时，能够从store中重用数据
```javascript
// actions.js 创建action creator
import { get } from '../../src/views/Request/ajaxPromise'
export function initializeTodos(dispatch, getState) {
  get('https://hacker-news.firebaseio.com/v0/topstories.json').then(
      response => {
        dispatch({ type: 'initializeTodos', payload: response })
      }
    )
}

// View.js 添加RDM
import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import store from '../../src/views/Container/store'
import { initializeTodos } from './action.js'

// 这种方式添加的RDM可以常驻内存
const removeModule = store.addModule({
    id: "todo-module",
    reducerMap: {
        todoState: todoReducer,
    },
    initialActions: [initializeTodos],
    finalActions: [],
})

function Component (props) {
  return <></>
}

const connectedComponent = connect(state => {
  todo: state.todoState
})(Component)

export default connectedComponent
```

[RDM]: https://redux-dynamic-modules.js.org/#/reference/Modules "RDM是redux dynamic module"
