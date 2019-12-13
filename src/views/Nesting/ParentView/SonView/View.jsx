import React from 'react'
import { Switch } from '../../../PluggableRouter'

export default function View (props) {
  console.debug('Son', props)
  const { children } = props
  return (
    <ul>
      <li>
        This is Son View
        <Switch>
          {children}
        </Switch>
      </li>
    </ul>
  )
}
