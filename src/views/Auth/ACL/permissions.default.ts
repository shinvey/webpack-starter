import { Permissions } from './PermissionManager'

export default {
  roles: [
    { name: 'guest' },
  ],
  resources: [],
  rules: [
    {
      access: 'allow',
      role: 'guest',
      privileges: null,
      resources: null
    }
  ]
} as Permissions
