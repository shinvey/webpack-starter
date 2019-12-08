import React from 'react'

export default function View (props) {
  console.debug('Son', props)
  const { children } = props
  return (
    <ul>
      <li>
        This is Son View
        {children}
      </li>
    </ul>
  )
}
