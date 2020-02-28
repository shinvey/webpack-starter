import { isStr } from 'sunny-js/util/string'
import { splitPath } from 'sunny-js/util/path'
import { memoize } from 'sunny-js/util/function'
import { getRoutePath, RouteLike } from '@/views/Auth/ACL/AccessControl'

interface Role {
  name: string
  parent: string
}

export type Resource = Role

export interface Rule {
  access: string
  role: string
  privileges: string[] | null
  resources: string[] | null
}

export interface Permissions {
  roles: Role[]
  resources: Resource[]
  rules: Rule[]
}

/**
 * 预定义对资源进行操作的相关关键词
 * 可以由此来判定path是否已经包含了内置privilege信息
 *
 * 用途：
 *  - 辅助识别或区分后台管理类应用路由的path
 */
const builtInActions = [
  // 操作类关键词
  'add', 'create', 'edit', 'del',
  // 查看类关键词
  'view', 'index', 'list', 'detail',
  // 导入导出
  'down', 'save', 'load', 'export', 'import'
]

/**
 * 补充缺失的Privileges为{@link actionExists}函数判断提供参考
 */
export function addMissingPrivileges (privileges: Rule[] | string[]) {
  const pushIfNotExists = (rule: string) => {
    builtInActions.includes(rule) || builtInActions.push(rule)
  }
  // 遍历所有访问规则
  privileges.forEach(rule => {
    if (isStr(rule)) {
      pushIfNotExists(rule)
    } else if (Array.isArray(rule.privileges)) {
      // 遍历当前访问规则，尝试加入新的privilege
      (rule as Rule).privileges.forEach(privilege => pushIfNotExists(privilege))
    }
  })
}

/**
 * 尝试判定预定义的Privileges是否至少有一个在route path中
 * 这样就可以辅助{@link getPrivilege}函数能够在route path中正常获取resource、privilege信息
 */
const actionExists: (path: string) => boolean = memoize((path) => {
  return builtInActions.some(keyword => path.indexOf(keyword) !== -1)
})
export { actionExists }

type GetRoutesFn = () => RouteLike[]
let getRoutes: GetRoutesFn = () => []
// 提供路由配置对象列表访问接口
export function useCustomGetRoutes (fn: GetRoutesFn) {
  getRoutes = fn
}
/**
 * 更新资源列表对象，以确保resources中的资源都是唯一的
 */
function updateResources (resources: { [name: string]: string }, mixedResources: string | Resource[]) {
  if (isStr(mixedResources)) {
    const path = mixedResources as string
    const segments = splitPath(path)
    if (actionExists(path)) {
      segments.pop()
    }
    segments.reduce((previousValue, currentValue) => {
      resources[currentValue] = resources[currentValue] || previousValue
      return currentValue
    }, undefined)
  } else if (Array.isArray(mixedResources)) {
    mixedResources.forEach(resource => {
      const { name, parent } = resource || {}
      if (name) {
        resources[name] = resources[name] || parent
      }
    })
  }
}
/**
 * 从类似路由paths中，生成ACL中的{@link Resource}
 * Note:
 * - resource必须保证唯一性
 */
export function generateResourcesFromRoutes (existingResources?: Resource[]) {
  const objResources = {}
  getRoutes().forEach(route => {
    const path = getRoutePath(route)
    if (Array.isArray(path)) {
      path.forEach(val => updateResources(objResources, val))
    } else {
      updateResources(objResources, path)
    }
  })
  updateResources(objResources, existingResources)
  return Object.entries<string>(objResources).map(([name, parent]) => ({
    name,
    parent
  }))
}

/**
 * 补充缺失的Resources。尝试从路由配置信息生成resources
 */
export function addMissingResources (ACLPermissions: Permissions) {
  ACLPermissions.resources = generateResourcesFromRoutes(
    ACLPermissions.resources
  )
  return ACLPermissions
}
