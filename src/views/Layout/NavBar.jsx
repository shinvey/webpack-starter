import React from 'react'

/**
 * 导航栏
 * 关于创建嵌套结构的菜单几点想法
 *
 * 树形结构的菜单可以通过route path信息来生成
 * 举例：
 * /parent
 * /parent/child
 * /parent/child/grandchild
 * 这几个路由是很明显树形结构，可以通过简单的遍历，重新整理路由表routes
 *
 * 基于树形结构的排序问题
 * 可以通过route对象，增加order字段，在以上树形结构创建的过程中，完成排序
 */
export default function NavBar ({ routes }) {
  return <></>
}
