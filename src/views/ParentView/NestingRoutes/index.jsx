// 树形结构路由信息
import { Route } from 'react-router-dom'
import { createElement } from 'react'
import { defArrRoutes } from './defArrRoutes'
// import { defTreeRoutes } from './defTreeRoutes'

/**
 * 生成嵌套路由组件数组
 * @param {object} treeRoutes
 * @param {object} [crossProps] 路由引用的组件都能够收到的props
 * @returns {ReactElement[]}
 */
function generateNestingRoutes (treeRoutes, crossProps = {}) {
  const RouteComponents = []
  Object.entries(treeRoutes).forEach(([segment, { route, Content, children }], index) => {
    if (route && Content) {
      // 创建路由
      const PassProps = transferProps => createElement(Route, {
        key: segment + index,
        ...route,
        children: createElement(Content, {
          // 允许父级组件给子组件传值
          ...transferProps,
          // 给所有在嵌套路由中的组件传递全局参数
          ...crossProps,
          // 使用递归嵌套路由组件
          children: children && generateNestingRoutes(children, crossProps),
        })
      })
      RouteComponents.push(createElement(PassProps, { key: [PassProps.name, segment + index].join('-') }))
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
