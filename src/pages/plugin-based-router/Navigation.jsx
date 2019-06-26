import React from 'react'

import { Navigation as IndexNav } from './Home'
import { Navigation as AboutNav } from './About'
import { Navigation as UsersNav } from './Users'

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
      </ul>
    </nav>
  )
}
