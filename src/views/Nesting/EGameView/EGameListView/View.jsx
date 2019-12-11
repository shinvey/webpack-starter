import React from 'react'

export default function View (props) {
  console.debug('EGameList', props)
  const { children, hello } = props
  return (
    <ul>
      <li>
        This is EGameList View<br />
        {hello}<br />
        {children}
      </li>
    </ul>
  )
}
