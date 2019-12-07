import React from 'react'

export default function View (props) {
  const { children } = props
  return (
    <ul>
      <li>
        This is Child View
        {children}
      </li>
    </ul>
  )
}
