import React from 'react'

import { Navigation as IndexNav } from './Home'
import { Navigation as AboutNav } from './About'
import { Navigation as UsersNav } from './User'
import { Navigation as TimerNav } from './Timer'

/**
 * 导航主体装配
 * @returns {*}
 * @constructor
 */
export default function Navigation () {
  return (
    <nav>
      <ul>
        <li>
          <IndexNav/>
        </li>
        <li>
          <AboutNav/>
        </li>
        <li>
          <UsersNav/>
        </li>
        <li>
          <TimerNav/>
        </li>
      </ul>
    </nav>
  )
}
