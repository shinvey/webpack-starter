import { Permissions } from '@/views/Auth/ACL/PermissionManager'

export default {
  roles: [
    { name: 'guest' },
    { name: 'member', parent: 'guest' },
    { name: 'manager', parent: 'member' },
    { name: 'admin' }
  ],
  resources: [
    /**
     * 通常情况下权限控制模块能够依据应用所有路由path信息自动创建resources
     * 对权限控制模块无法正常识别的路由资源（如：/），进行手动添加，同时路由配置
     * 也需要增加resource字段与之名称对应
     */
    { name: 'home' }
  ],
  rules: [
    {
      access: 'allow',
      role: 'guest',
      privileges: ['view'],
      resources: ['home', 'user']
    }, {
      access: 'allow',
      role: 'member',
      privileges: ['view'],
      resources: ['admin', 'app']
    }, {
      access: 'allow',
      role: 'manager',
      privileges: null,
      resources: ['admin', 'process']
    }, {
      access: 'allow',
      role: 'admin',
      privileges: null,
      resources: null
    }
  ]
} as Permissions
