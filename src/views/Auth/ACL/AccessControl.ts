import Acl from 'acljs'
import { splitPath } from 'sunny-js/util/path'
import { actionExists, Permissions } from '@/views/Auth/ACL/PermissionManager'

export interface ACLRouteProps {
  // 当前路由所属资源（resource）
  resource?: string
  // 当前路由组件对应的特权（privilege）
  privilege?: string
}

export interface RouteLike {
  path: string,
  [key: string]: any
}

// 实现读取路由path接口
type GetRoutePathFn<T> = (route: T) => string
export let getRoutePath = route => (route as RouteLike).path
export function useCustomGetRoutePath<T> (fn: GetRoutePathFn<T>) {
  getRoutePath = fn
}

// 实现route path解析器，返回resource、privilege
type GetPrivilegeFn<T> = (route: ACLRouteProps & T) => ACLRouteProps
let getPrivilege: GetPrivilegeFn<ACLRouteProps> = route => {
  // 先将path分割成片段
  const path = getRoutePath(route)
  const segments = splitPath(path)

  // 非后台管理类的path默认privilege为view（查看）
  let privilege = actionExists(path) ? segments.pop() : 'view'
  // 优先使用路由配置中的相关字段
  privilege = route.privilege || privilege

  let resource = segments.pop()
  resource = route.resource || resource

  return { resource, privilege }
}
// 允许外部实现getPrivilege逻辑
export function useCustomGetPrivilege<T> (fn: GetPrivilegeFn<T>) {
  getPrivilege = fn
}

// 访问当前用户角色接口
type GetRoleFn = () => string
export let getRole: GetRoleFn = () => 'guest'
/**
 * 权限管理模块需要访问当前用户角色
 * 允许外部实现getRole逻辑
 */
export function useCustomGetRole (fn: GetRoleFn) {
  getRole = fn
}

interface ACL {
  isAllowed: (role: string, resource: string, privilege: string) => boolean
}
let acl: null | ACL = null
/**
 * 单例模式创建ACL实例，并初始化好权限
 * 该方法可以重复调用
 */
export function initACL (permissions: Permissions) {
  return acl = acl || new Acl(permissions)
}

// 权限验证
export function isAllowed(route: ACLRouteProps) {
  let allowed = false
  if (acl) {
    const role = getRole()
    const { resource, privilege } = getPrivilege(route)
    try {
      allowed = acl.isAllowed(role, resource, privilege)
    } catch (e) {
      console.error(e)
    }
    process.env.IS_DEV && console.debug(
      role,
      allowed ? 'is' : 'is not',
      'allowed to',
      (privilege||'?') + '(privilege)', (resource||'?') + '(resource)')
  }
  return allowed
}
