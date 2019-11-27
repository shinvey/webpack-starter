import React from 'react'
import { Switch } from 'react-router-dom'
import { contents, customContents, routes } from '../PluggableRouter'
import ErrorBoundary from '../components/ErrorBoundary'

/**
 * Container内容部分
 * layout
 * 路由搭配模式
 * nested 当前的渲染方式直接支持此用例 https://reacttraining.com/react-router/web/example/nesting
 * auth
 * custom todo 思考custom使用场景，是否真的需要嵌套在switch组件中
 * header
 * footer
 * @param {object} props
 * @param {*} [props.children]
 */
export default function Content ({ children }) {
  return <ErrorBoundary routes={routes}>
    <Switch>
      {contents}
      {customContents}
      {children}
    </Switch>
  </ErrorBoundary>
}
