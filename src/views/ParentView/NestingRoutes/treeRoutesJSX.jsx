// 生成的JSX代码例子
import { Route } from 'react-router'
import React from 'react'
import {
  BrotherContent,
  ChildContent,
  GrandchildContent,
  ParentContent
} from './components'

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
