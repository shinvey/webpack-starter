import React from 'react'
import { Switch } from 'react-router-dom'
import { contents, customContents, routes } from '../PluggableRouter'
import ErrorBoundary from '../components/ErrorBoundary'

/**
 * Container内容部分
 * @param {object} props
 * @param {*} [props.children]
 */
export function Content ({ children }) {
  return <ErrorBoundary routes={routes}>
    <Switch>
      {contents}
      {customContents}
      {children}
    </Switch>
  </ErrorBoundary>
}
