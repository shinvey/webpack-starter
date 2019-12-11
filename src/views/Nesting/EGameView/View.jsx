import React from 'react'

export default function View (props) {
  console.debug('EGame', props)
  const { children, hello } = props
  return (
    <ul>
      <li>
        This is EGame View<br />
        {hello}<br />
        {children}
      </li>
    </ul>
  )
}
