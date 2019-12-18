// 树形结构路由信息
import { Route } from 'react-router-dom'
import { createElement } from 'react'

/**
 * @typedef {object} routeProps
 * @property {string} path for example: parent/child/grandchild
 * @property {string} [nest] like path 可选，用于重写默认嵌套规则
 */

/**
 * 用于解析路由path路径的嵌套关系
 * 将类似parent/child/grandchild字符串分成片段，处理好动态path路径
 * @param {routeProps} route
 * @returns {array} 返回一维嵌套关系数组
 */
function routeToNestedSegments (route) {
  const regexp = /^[\w-]+$/i
  // 优先使用nest属性，随后是path。nest属性用来改写嵌套关系。
  let nest = route.nest || route.path
  // 如果path/rest是数组只用第一个元素
  nest = Array.isArray(nest) ? nest[0] : nest
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

      // 遍历过程中是否已经到达最后一个节点
      const isLast = segments.length - 1 === index
      /**
       * 如果某个路由使用exact属性
       * - 表明其他路由也使用了他的path作为前缀
       * - 它与path后的路径所对应的路由不是嵌套关系
       * 例如有如下三个视图：
       * parent/son exact son继承自parent，但是一个独立视图，不参与子路由继承关系
       * parent/son son继承自parent，且参与子路由继承关系
       * parent/son/grandson grandson继承自son，son继承自parent
       * 采取措施：
       * 为parent/son exact另外创建一个作为parent/son的兄弟节点，
       * 就可以避免破坏parent/son/grandson之间的继承关系
       */
      if (isLast && route.exact) {
        segment = [segment, route.key || index].join('-')
      }
      // exact 和 nest属性都有一个共同意图，就是路由解析优先级高于默认的嵌套路由
      if (route.exact || route.nest) {
        route.sort = route.sort || -1 // 提高Route解析优先级
      }
      // 如果叶子节点已经创建则使用已有节点，没有则创建
      const leaf = accumulator[segment] = accumulator[segment] || {}
      // 如果到达path片段的最末位
      if (isLast) {
        // 有冲突的嵌套路由检测
        leaf.route && console.error('Warning: ', leaf.route, ' and ', route, ' appear to be in' +
          ' conflict with each other. The one of them should be changed in' +
          ' different path/nest property')
        // 存储route、Content
        return Object.assign(leaf, {
          route,
          Content
        })
      } else { // 如果还没到path最末位，创建子节点
        // 添加新的叶子节点，children体现当前节点有被继承的关系
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
 * @returns {{ arrRouteComponents: ReactNode[], objRouteComponents: object }}
 */
export function generateNestingRoutes (treeRoutes, options) {
  const { props: crossProps = {}, pickRoute = () => Route } = options

  // 存放组装好的Route组件列表
  const arrRouteComponents = []
  // 可以通过route.key访问的Route组件列表
  const objRouteComponents = {}

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
        // 为route key设置默认值
        route.key = route.key || segment + index
        // 创建路由
        // 使用PassProps包装Route组件辅助向下传递props参数，因为Route组件不会帮你传
        const PassProps = ({
          // 辅助Switch工作的属性，不需要传递给子组件
          path,
          from,
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
                const {
                  arrRouteComponents: arrChildren,
                  objRouteComponents: objChildren
                } = generateNestingRoutes(children, options)
                // 子组件可以简单通过props.children渲染子级路由
                contentProps.children = arrChildren
                // 子组件也可以通过route.key访问子路由组件，用于更精细的控制
                contentProps.childrenRoutes = objChildren
              }
              return createElement(Content, contentProps)
            }
          })
        }
        const RouteComponent = createElement(PassProps, {
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
          from: route.from, // 来自此用例场景 https://reacttraining.com/react-router/web/api/Switch/children-node
          exact: route.exact,
          strict: route.strict,
          location: route.location,
          sensitive: route.sensitive,
          key: [PassProps.name, route.key].join('-'),
        })
        objRouteComponents[route.key] = RouteComponent
        arrRouteComponents.push(RouteComponent)
      } else if (children) {
        /**
         * 处理断层嵌套关系，断层指的是，父级不是一个视图，只是展示一种层次关系
         * app/user/login app是一个视图，user不是一个视图，login是视图且被app嵌套，那user则是断层
         */
        const {
          arrRouteComponents: arrChildren,
          objRouteComponents: objChildren
        } = generateNestingRoutes(children, options)
        Object.assign(objRouteComponents, objChildren)
        arrRouteComponents.push(...arrChildren)
      }
    })
  return {
    arrRouteComponents,
    objRouteComponents,
  }
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
  // console.debug('arrRoutes', arrRoutes)
  const treeRoutes = arrRoutesToTreeRoutes(arrRoutes)
  // console.debug('treeRoutes', treeRoutes)
  const {
    arrRouteComponents: nestingRoutes,
    // objRouteComponents: objNestingRoutes
  } = generateNestingRoutes(treeRoutes, options)
  // console.debug('nestingRoutes', nestingRoutes)
  // console.debug('objNestingRoutes', objNestingRoutes)
  return nestingRoutes
}
