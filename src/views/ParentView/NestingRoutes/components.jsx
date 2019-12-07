import React, { Children, cloneElement } from 'react'

export const ParentContent = props => {
  console.debug('ParentContent', props)
  const { children, routes } = props
  return <ul>
    <li>
      This ParentContent<br/>
      {routes.test.path}
      {/* 为子组件传值的用例 */}
      {Children.map(children, child => cloneElement(child, { hello: 'The param from parent' }))}
    </li>
  </ul>
}
export const ChildContent = props => {
  console.debug('ChildContent', props)
  const { children, routes, hello } = props
  return <ul>
    <li>
      This ParentContent<br/>
      {routes.test.path}<br/>
      {hello}
      {/* {children} */}
      {Children.map(children, child => cloneElement(child, { hello: 'the param from child' }))}
    </li>
  </ul>
}
export const GrandchildContent = props => {
  console.debug('GrandchildContent', props)
  const { children, routes, hello } = props
  return <ul>
    <li>
      This ParentContent<br/>
      {routes.test.path}<br/>
      {hello}
      {children}
      {/* {Children.map(children, child => cloneElement(child, { hello: 'from parent' }))} */}
    </li>
  </ul>
}
export const BrotherContent = props => {
  console.debug('BrotherContent', props)
  const { children, routes } = props
  return <ul>
    <li>
      This ParentContent<br/>
      {routes.test.path}
      {children}
      {/* {Children.map(children, child => cloneElement(child, { hello: 'from parent' }))} */}
    </li>
  </ul>
}
