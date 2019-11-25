import { Link } from 'react-router-dom'
import React, { Fragment } from 'react'

export function Navigation ({ routes }) {
  return <Fragment>
    <h1>视图目录：</h1>
    <ul>
      {Object.values(routes).map((route, key) => <li key={key}><Link to={route.path}>{route.name}</Link></li>)}
    </ul>
  </Fragment>
}
