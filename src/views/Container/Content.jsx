import React from 'react'
import { Switch } from 'react-router-dom'
import { contents, customContents, routes } from '../PluggableRouter'
import ErrorBoundary from '../components/ErrorBoundary'

export function Content ({ children }) {
  return <ErrorBoundary routes={routes}>
    <Switch>
      {contents}
      {customContents}
      {children}
    </Switch>
  </ErrorBoundary>
}
