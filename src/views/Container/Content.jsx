import React from 'react'
import { Switch } from 'react-router'
import { useRouteComponents, useRoutes } from '../PluggableRouter'
import ErrorBoundary from '../components/ErrorBoundary'
import './settings'
import './style.scss'

/**
 * Container内容部分
 * @param {object} props
 * @param {*} [props.children]
 */
export default function Content ({ children }) {
  return (
    <ErrorBoundary routes={useRoutes()}>
      <Switch>
        {useRouteComponents()}
        {children}
      </Switch>
    </ErrorBoundary>
  )
}
