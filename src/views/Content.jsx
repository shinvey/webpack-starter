import React from 'react'

import ErrorBoundary from './deps/ErrorBoundary'

import { Content as IndexContent } from './Home'
import { Content as AboutContent } from './About'
import { Content as UsersContent } from './User'
import { Content as LoginContent } from './User/Login'
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
