import React, { Fragment } from 'react'

export default function View (props) {
  return <Fragment>
    <h2>About</h2>
    <p>This is about content</p>
    <p>{JSON.stringify(props)}</p>
  </Fragment>
}
