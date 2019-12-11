import React from 'react'

export default function View (props) {
  console.debug('Grandson', props)
  const { children, hello } = props
  return (
    <ul>
      <li>
        This is Grandson View<br />
        {hello}<br />
        {children}
      </li>
    </ul>
  )
}
