import React from 'react'

export default function View (props) {
  console.debug('Kid', props)
  const { children, hello } = props
  return (
    <ul>
      <li>
        This is Kid View<br />
        {hello}<br />
        {children}
      </li>
    </ul>
  )
}
