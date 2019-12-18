import { Link } from 'react-router-dom'
import React, { Fragment } from 'react'

/**
 * 考虑复杂的菜单用例
 * 树形菜单
 * 菜单可以定制
 */
export function Navigation ({ routes }) {
  return <Fragment>
    <h1>视图目录：</h1>
    <ul>
      {Object.values(routes).map((route, key) => <li key={key}><Link to={route.toPath({ id: 'test' })}>{route.name}</Link></li>)}
    </ul>
  </Fragment>
}
