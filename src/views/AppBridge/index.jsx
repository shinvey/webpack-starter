import React from 'react'
import ErrorBoundary from '../components/ErrorBoundary'
import viewScanner from '../viewScanner'

const contents = viewScanner({
  iteratee (ViewModule) {
    const Content = ViewModule.Content
    const key = ViewModule.navigation.name
    return <Content key={key} />
  }
})

export default function AppBridge () {
  return <ErrorBoundary>
    {contents}
  </ErrorBoundary>
}
