import React from 'react'

export default function View (props) {
  console.debug('Grandchild', props)
  const { children, hello } = props
  return (
    <ul>
      <li>
        This is Grandchild View<br />
        {hello}<br />
        {children}
      </li>
    </ul>
  )
}
