import React from 'react'
import { Switch } from 'react-router-dom'
import { rootContents, routes } from '../PluggableRouter'
import ErrorBoundary from '../components/ErrorBoundary'

/**
 * 如果下一步计划有必要将部分路由组件提升到根结点，可以考虑移动到此处。
 * 再由旧应用引入
 * @param {object} props
 * @param {*} [props.children]
 */
export default function Root ({ children }) {
  return (
    <ErrorBoundary routes={routes}>
      <Switch>
        {rootContents}
        {children}
      </Switch>
    </ErrorBoundary>
  )
}
