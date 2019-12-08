import React from 'react'

export default function View (props) {
  console.debug('Brother', props)
  const { children, hello } = props
  return (
    <ul>
      <li>
        This is Brother View<br />
        {hello}<br />
        {children}
      </li>
    </ul>
  )
}
