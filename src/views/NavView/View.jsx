import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

export default function View (props) {
  const navigations = props.routes
  return <Fragment>
    <b>视图目录：</b>
    <ul>
      {navigations.map((nav, key) => <li key={key}><Link to={nav.path}>{nav.name}</Link></li>)}
    </ul>
  </Fragment>
}
