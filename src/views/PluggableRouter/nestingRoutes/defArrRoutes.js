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
      dir: '/parent'
    },
    Content: ParentContent
  },
  {
    route: {
      dir: '/parent/child'
    },
    Content: ChildContent
  },
  {
    route: {
      dir: '/parent/child/grandchild'
    },
    Content: GrandchildContent
  },
  {
    route: {
      dir: '/parent/brother'
    },
    Content: BrotherContent
  }
]
