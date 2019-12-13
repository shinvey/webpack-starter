import React from 'react'
import { Switch } from 'react-router-dom'
import { normalRoutes, routes } from '../PluggableRouter'
import ErrorBoundary from '../components/ErrorBoundary'

/**
 * Container内容部分
 * @param {object} props
 * @param {*} [props.children]
 */
export default function Content ({ children }) {
  return (
    <ErrorBoundary routes={routes}>
      <Switch>
        {normalRoutes}
        {children}
      </Switch>
    </ErrorBoundary>
  )
}
