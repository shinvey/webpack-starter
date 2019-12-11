import {
  BrotherContent,
  ChildContent,
  GrandchildContent,
  ParentContent
} from './components'

/**
 * 一维数组结构 路由信息表
 * @type {*[]}
 */
export const defArrRoutes = [
  {
    route: {
      path: '/parent'
    },
    Content: ParentContent
  },
  {
    route: {
      path: '/parent/child'
    },
    Content: ChildContent
  },
  {
    route: {
      path: '/parent/child/grandchild'
    },
    Content: GrandchildContent
  },
  {
    route: {
      path: '/parent/brother'
    },
    Content: BrotherContent
  }
]
