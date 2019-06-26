import React from 'react'

import ErrorBoundary from './ErrorBoundary'

import { Content as IndexContent } from './Index'
import { Content as AboutContent } from './About'
import { Content as UsersContent } from './Users'
import { Content as LoginContent } from './Users/Login'

export default function Content () {
  return (
    <ErrorBoundary>
      <LoginContent/>
      <IndexContent/>
      <AboutContent/>
      <UsersContent/>
    </ErrorBoundary>
  )
}
