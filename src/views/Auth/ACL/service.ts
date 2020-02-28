import permissions from './permissions.default'
import { loadFromStorage, saveToSession } from 'sunny-js/util/storage'
import { isStr } from 'sunny-js/util/string'
import { noop } from 'sunny-js/util/function'
import {
  Permissions,
  addMissingResources,
  addMissingPrivileges
} from './PermissionManager'

type FetchPermissionsFn = () => Promise<Permissions>
type CachePermissionsFn = (keyOrData: string | Permissions) => Permissions | undefined

/**
 * 缓存Permissions，默认使用sessionStorage
 */
function WrapFetchPermissions (
  ajax: FetchPermissionsFn,
  cache: CachePermissionsFn = noop
) {
  let ajaxP = ajax()
  const cachedACLPermissions = cache('ACLPermissions')
  if (cachedACLPermissions) { // 优先使用缓存
    ajaxP = Promise.resolve(cachedACLPermissions)
  } else { // 从服务器读取
    // 确保在isAllowed方法调用之前，补充缺失的Privileges、Resources
    ajaxP = ajaxP.then(ACLPermissions => {
      addMissingResources(ACLPermissions)
      addMissingPrivileges(ACLPermissions.rules)
      // 缓存下来
      cache(ACLPermissions)
      return ACLPermissions
    })
  }
  return ajaxP
}

let fetchPermissionsFn: FetchPermissionsFn = () => Promise.resolve(permissions)
let cachePermissionsFn: CachePermissionsFn = keyOrData => isStr(keyOrData)
  ? loadFromStorage('ACLPermissions')
  : saveToSession({ ACLPermissions: keyOrData })
export function fetchPermissions () {
  return WrapFetchPermissions(
    fetchPermissionsFn,
    cachePermissionsFn
  )
}
// 对外提供定制ajax请求逻辑，cache缓存逻辑接口
export function useCustomFetchPermissions (ajaxFn: FetchPermissionsFn, cacheFn: CachePermissionsFn ) {
  fetchPermissionsFn = ajaxFn
  cachePermissionsFn = cacheFn
}
