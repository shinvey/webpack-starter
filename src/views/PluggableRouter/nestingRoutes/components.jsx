import React, { Children, cloneElement, useState } from 'react'
import { Switch } from 'react-router'

export const ParentContent = props => {
  console.debug('ParentContent', props)
  const { children, routes } = props
  // 是否会重复渲染子组件测试代码
  const [hello, setHello] = useState(1)
  return <ul>
    <li>
      This ParentContent<br/>
      <button onClick={() => setHello(2)}>setHello</button><br/>
      {routes.test.path}
      {/* 支持使用Switch */}
      <Switch>
        {/* 为子组件传值的用例 */}
        {Children.map(children, child => cloneElement(child, { hello }))}
        {/* {children} */}
      </Switch>
    </li>
  </ul>
}
export const ChildContent = props => {
  console.debug('ChildContent', props)
  const { children, routes, hello } = props
  return <ul>
    <li>
      This ChildContent<br/>
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
  const { children, routes, hello } = props
  return <ul>
    <li>
      This BrotherContent<br/>
      {routes.test.path}<br/>
      {hello}
      {children}
      {/* {Children.map(children, child => cloneElement(child, { hello: 'from parent' }))} */}
    </li>
  </ul>
}
