// 生成的JSX代码例子
import { Route } from 'react-router'
import React from 'react'
import {
  BrotherContent,
  ChildContent,
  GrandchildContent,
  ParentContent
} from './components'
import { defArrRoutes } from './defArrRoutes'
// import { defTreeRoutes } from './defTreeRoutes'
import {
  arrRoutesToTreeRoutes,
  generateNestingRoutes
} from './index'

export const treeRoutesJSX = <>
  <Route path={'/parent'}>
    <ParentContent>
      <Route path={'/parent/child'}>
        <ChildContent>
          <Route path={'/parent/child/grandchild'}>
            <GrandchildContent />
          </Route>
        </ChildContent>
      </Route>
      <Route path={'/parent/brother'}>
        <BrotherContent/>
      </Route>
    </ParentContent>
  </Route>
</>

// 为所有组件传递的props测试对象
const routes = {
  test: { path: '/test' }
}
const _treeRoutes = arrRoutesToTreeRoutes(defArrRoutes)
console.debug('treeRoutes', _treeRoutes)
const NestingRoutes = generateNestingRoutes(_treeRoutes, { props: { routes } })
console.debug('NestingRoutes', NestingRoutes)
export { NestingRoutes }
