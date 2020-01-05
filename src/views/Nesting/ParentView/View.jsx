import React, { Children, cloneElement } from 'react'
import { Switch } from 'react-router'
// import { NestingRoutes } from './NestingRoutes/treeRoutesJSX'

export default function View (props) {
  console.debug('Parent', props)
  const { children } = props
  return (
    <ul>
      <li>
        This is Parent View
        {/* {children} */}
        {/* 嵌套Switch测试代码，可以不用嵌套 */}
        {/* <Switch>{children}</Switch> */}
        <Switch>{Children.map(children, child => cloneElement(child, { hello: 'hello from Parent' }))}</Switch>
      </li>
    </ul>
  )
}
