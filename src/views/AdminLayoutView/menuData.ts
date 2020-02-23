import { MenuDataItem } from '@ant-design/pro-layout'

/**
 * 后台管理界面BaseLayout左侧栏菜单
 * @todo 这里的菜单配置对象将会被改造成自动生成
 */
export default [
  {
    path: 'admin/welcome',
    name: '欢迎',
  },
  {
    path: 'admin',
    name: '申请单',
    children: [
      {
        name: '申请单列表',
        path: 'process',
        children: [
          {
            name: '申请单详情',
            path: 'detail/:id',
            hideInMenu: true,
          },
          {
            name: '编辑申请单',
            path: 'edit/:id',
            hideInMenu: true,
          },
          {
            name: '添加申请单',
            path: 'add',
            hideInMenu: true,
          },
        ]
      },
    ],
  },
] as MenuDataItem[]
