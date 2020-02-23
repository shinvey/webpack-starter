import React from 'react'
import { Link } from 'react-router-dom'

export default function View ({ routes }) {
  return <>
    <div>This is 申请单列表</div>
    <Link to={routes.processAdd.toPath()}>添加</Link>
    <table>
      <thead>
      <tr>
        <th>标题</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>申请单1</td>
        <td>
          <Link to={routes.processDetail.toPath({ id: 1 })}>详情</Link>
          <Link to={routes.processEdit.toPath({ id: 1 })}>编辑</Link>
        </td>
      </tr>
      <tr>
        <td>申请单2</td>
        <td>
          <Link to={routes.processDetail.toPath({ id: 2 })}>详情</Link>
          <Link to={routes.processEdit.toPath({ id: 2 })}>编辑</Link>
        </td>
      </tr>
      </tbody>
    </table>
  </>
}
