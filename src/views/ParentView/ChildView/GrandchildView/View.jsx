import React from 'react'

export default function View (props) {
  const { children } = props
  return (
    <ul>
      <li>
        This is Grandchild View
        {children}
      </li>
    </ul>
  )
}
