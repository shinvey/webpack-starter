// 树形结构路由信息
import { Route } from 'react-router-dom'
import { createElement } from 'react'

/**
 * @typedef {object} routeProps
 * @property {string} path for example: parent/child/grandchild
 * @property {string} [nest] like path 可选，用于重写默认嵌套规则
 */

/**
 * 将类似parent/child/grandchild字符串分成片段
 * 将于解析视图的嵌套关系
 * @param {routeProps} route
 * @returns {array} 返回一维嵌套关系数组
 */
function routeToNestedSegments (route) {
  const regexp = /^[\w-]+$/i
  const nest = route.nest || route.path
  if (!nest) throw new Error('There must be a nest(like path) or path property in your ' + JSON.stringify(route) + ' at least')
  const segments = nest.split('/').filter(segment => regexp.test(segment))
  // 我层级结构视为孤立或独立无嵌套关系视图
  if (segments.length === 0) segments.push('_orphan_')
  // console.debug('segments', segments)
  return segments
}

/**
 * 将路由信息由 一维数组路 转换成 树形结构对象
 * @param {routeProps[]} arrRoutes
 * @returns {object} treeRoutes
 * @throws {Error} 如果route对象中没有定义dir属性，则会抛出异常
 */
export function arrRoutesToTreeRoutes (arrRoutes) {
  const treeRoutes = {}
  arrRoutes.forEach(({ route, Content }) => {
    const segments = routeToNestedSegments(route)
    segments.reduce((accumulator, segment, index) => {
      // 如果为空，跳过，处理下一个
      if (!segment) {
        return accumulator
      }

      // 如果叶子节点已经创建则使用已有节点，没有则创建
      let leaf = accumulator[segment] = accumulator[segment] || {}
      // 如果到达path片段的最末位
      if (segments.length - 1 === index) {
        // 如果route/Content已存在，创建新的兄弟节点
        if ('route' in leaf) {
          leaf = accumulator[[segment, route.key || index].join('-')] = {}
        }
        // 存储route、Content
        return Object.assign(leaf, {
          route,
          Content
        })
      } else { // 如果还没到path最末位，创建子节点
        // 添加新的叶子节点
        return leaf.children = leaf.children || {}
      }
    }, treeRoutes)
  })
  return treeRoutes
}

/**
 * @typedef {object} nestingRoutesOptions
 * @property {object} [props] 给路由组件和子组件传递的参数
 * @property {function} [pickRoute] 路由选择器
 */

/**
 * 生成嵌套路由组件数组，可以被React直接渲染
 * __解决了三个问题__
 * - 路由可以嵌套
 * - 父组件可以向下传递props
 * - 可以被Switch嵌套
 * @param {object} treeRoutes
 * @param {nestingRoutesOptions} [options]
 * @returns {ReactNode[]}
 */
export function generateNestingRoutes (treeRoutes, options) {
  const { props: crossProps = {}, pickRoute = () => Route } = options
  const RouteComponents = []
  Object.entries(treeRoutes)
    /**
     * 满足兄弟路由path前缀相同，且搭配Router Switch组件使用时，而产生的排序问题
     * 在树形结构数据中可能嵌套n层的情况下，这里的排序行为，仅仅影响当前层级的兄弟路由。
     */
    .sort((
      [, { route: { sort: aSort = 0 } = {} }],
      [, { route: { sort: bSort = 0 } = {} }]) => aSort - bSort)
    .forEach(([segment, { route, Content, children }], index) => {
      if (route && Content) {
      // 创建路由
      // 使用PassProps包装Route组件辅助向下传递props参数，因为Route组件不会帮你传
        const PassProps = ({
        // 辅助Switch工作的属性，不需要传递给子组件
          path,
          exact,
          strict,
          location,
          sensitive,
          // 搬运来自父组件的自定义参数
          ...transferProps
        }) => {
          return createElement(pickRoute(route), {
          // 嵌套关系下的组件都能够收到的自定参数，我用来传递路由信息表
            ...crossProps,
            route,
            // Route正常运作的功能参数
            key: segment + index,
            ...route,
            render (routeProps) {
              const contentProps = {
              // 允许父级组件给子组件传值
                ...transferProps,
                // 给所有在嵌套路由中的组件传递全局参数
                ...crossProps,
                route,

                // 路由Route组件传入的props
                ...routeProps,
              }
              if (children) {
              // 使用递归来嵌套路由组件
                contentProps.children = generateNestingRoutes(children, options)
              }
              return createElement(Content, contentProps)
            }
          })
        }
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
          // 初path外，其他参数也同样会影响Switch行为例如 exact, strict, sensitive, location...
          path: route.path,
          exact: route.exact,
          strict: route.strict,
          location: route.location,
          sensitive: route.sensitive,
          key: [PassProps.name, segment + index].join('-'),
        }))
      } else if (children) {
        RouteComponents.push(...generateNestingRoutes(children, options))
      }
    })
  return RouteComponents
}

/**
 * 路由信息数组转换成嵌套路由组件，可以被React直接渲染
 * @param {array} arrRoutes
 * @param {nestingRoutesOptions} [options]
 * @returns {ReactNode[]}
 */
export function arrRoutesToNestingRoutes (arrRoutes, options) {
  // const toPath = compile('/parent/:child/grandchild/:id', { encode: encodeURIComponent })
  // console.debug('toPath', toPath())
  // console.debug('routeToNestedSegments', routeToNestedSegments({ path: '/' }))
  // console.debug('routeToNestedSegments', routeToNestedSegments({ path: '*' }))
  // console.debug('routeToNestedSegments', routeToNestedSegments({ path: '/:id' }))
  // console.debug('routeToNestedSegments', routeToNestedSegments({ path: '/parent/:child/grandchild' }))
  // console.debug('routeToNestedSegments', routeToNestedSegments({ path: '/parent/:child/grandchild/:id' }))
  console.debug('arrRoutes', arrRoutes)
  const treeRoutes = arrRoutesToTreeRoutes(arrRoutes)
  console.debug('treeRoutes', treeRoutes)
  const nestingRoutes = generateNestingRoutes(treeRoutes, options)
  console.debug('nestingRoutes', nestingRoutes)
  return nestingRoutes
}
