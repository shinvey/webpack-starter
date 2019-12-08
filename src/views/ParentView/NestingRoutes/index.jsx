// 树形结构路由信息
import { Route } from 'react-router-dom'
import { createElement } from 'react'
import { defArrRoutes } from './defArrRoutes'
// import { defTreeRoutes } from './defTreeRoutes'

/**
 * 生成嵌套路由组件数组
 * @param {object} treeRoutes
 * @param {object} [crossProps] 路由引用的组件都能够收到的props
 * @returns {ReactNode[]}
 */
function generateNestingRoutes (treeRoutes, crossProps = {}) {
  const RouteComponents = []
  Object.entries(treeRoutes).forEach(([segment, { route, Content, children }], index) => {
    if (route && Content) {
      // 创建路由
      // 使用PassProps包装Route组件辅助向下传递props参数，因为Route组件不会帮你传
      const PassProps = ({
        path, // path是辅助Switch工作的属性，不需要传递给子组件
        ...transferProps
      }) => createElement(Route, {
        key: segment + index,
        ...route,
        render (routeProps) {
          const contentProps = {
            // 允许父级组件给子组件传值
            ...transferProps,
            // 给所有在嵌套路由中的组件传递全局参数
            ...crossProps,
            // 路由组件传入的props
            ...routeProps,
          }
          if (children) {
            // 使用递归来嵌套路由组件
            contentProps.children = generateNestingRoutes(children, crossProps)
          }
          return createElement(Content, contentProps)
        }
      })
      RouteComponents.push(createElement(PassProps, {
        /**
         * 如果使用PassProps包装Route，则会丧失使用Router Switch组件的能力，因为通常
         * 我们对Route的包装是想赋予路由更高级的特性，并把包装后的组件当成Route组件使用。
         *
         * 这里的目的只是让父组件能够传递参数给子组件。问题的关键是一个叫path的参数。
         *
         * Switch主要依赖子组件的path，来执行它的功能，将path放入PassProps的props列表中
         * 就可以辅助Switch的Route组件切换逻辑。被匹配到path的组件会额外接收到一个computedMatch
         * https://github.com/ReactTraining/react-router/blob/ea44618e68f6a112e48404b2ea0da3e207daf4f0/packages/react-router/modules/Switch.js#L40
         */
        path: route.path,
        key: [PassProps.name, segment + index].join('-'),
      }))
    }
  })
  return RouteComponents
}

/**
 * 将路由信息由 一维数组路 转换成 树形结构对象
 * @param {array} arrRoutes
 * @returns {object} treeRoutes
 */
function arrRoutesToTreeRoutes (arrRoutes) {
  const treeRoutes = {}
  arrRoutes.forEach(({ route, Content }) => {
    const segments = route.path.split('/')
    segments.reduce((accumulator, segment, index) => {
      // 如果为空，跳过，处理下一个
      if (!segment) {
        return accumulator
      }

      // 创建叶子节点
      const leaf = accumulator[segment] = accumulator[segment] || {}
      // 如果到达URL片段的最末位
      if (segments.length - 1 === index) {
        // 存储route、Content
        return Object.assign(leaf, {
          route,
          Content
        })
      } else { // 如果还没到最末位
        // 添加新的叶子节点
        return leaf.children = leaf.children || {}
      }
    }, treeRoutes)
  })
  return treeRoutes
}

// 为所有组件传递的props测试对象
const routes = {
  test: { path: '/test' }
}
const _treeRoutes = arrRoutesToTreeRoutes(defArrRoutes)
console.debug('treeRoutes', _treeRoutes)
const NestingRoutes = generateNestingRoutes(_treeRoutes, { routes })
console.debug('NestingRoutes', NestingRoutes)
export default NestingRoutes
