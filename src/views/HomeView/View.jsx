import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

export default function View () {
  return <Fragment>
    <h2>Home</h2>
    <p>Hello world!</p>
    <p><Link to='/nav'>视图导航</Link></p>
    <p><Link to='/user/login'>用户登录</Link></p>
  </Fragment>
}
