import React from 'react'

import ErrorBoundary from './ErrorBoundary'

import { Content as IndexContent } from './Index'
import { Content as AboutContent } from './About'
import { Content as UsersContent } from './Users'

export default function Content () {
  return (
    <ErrorBoundary>
      <IndexContent/>
      <AboutContent/>
      <UsersContent/>
    </ErrorBoundary>
  )
}
