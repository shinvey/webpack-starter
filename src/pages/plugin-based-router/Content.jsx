import React from 'react'

import ErrorBoundary from './ErrorBoundary'

import { Content as IndexContent } from './Home'
import { Content as AboutContent } from './About'
import { Content as UsersContent } from './Users'
import { Content as LoginContent } from './Users/Login'
import { Content as TimerContent } from './Timer'

/**
 * 内容主体装配
 * @returns {*}
 * @constructor
 */
export default function Content () {
  return (
    <ErrorBoundary>
      <LoginContent/>
      <IndexContent/>
      <AboutContent/>
      <UsersContent/>
      <TimerContent/>
    </ErrorBoundary>
  )
}
