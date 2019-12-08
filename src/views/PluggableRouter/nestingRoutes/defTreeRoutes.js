import {
  BrotherContent,
  ChildContent,
  GrandchildContent,
  ParentContent
} from './components'

/**
 * 根据路由path信息生成的 树形结构 路由信息表
 */
export const defTreeRoutes = {
  parent: {
    route: {
      path: '/parent',
    },
    Content: ParentContent,
    children: {
      child: {
        route: {
          path: '/parent/child',
        },
        Content: ChildContent,
        children: {
          grandchild: {
            route: {
              path: '/parent/child/grandchild',
            },
            Content: GrandchildContent,
          }
        }
      },
      brother: {
        route: {
          path: '/parent/brother',
        },
        Content: BrotherContent,
      }
    },
  }
}
