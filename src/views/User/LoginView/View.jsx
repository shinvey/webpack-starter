import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { loginSuccess } from '../../Auth/channel'
import { updateUserInfoAction } from '@/views/User/userRDM/userActions'

const View = connect()((props) => {
  const { location: { state: { from } = {} }, dispatch } = props
  return <Fragment>
    <h1>用户登录</h1>
    <button onClick={() => {
      // 更新用户信息
      dispatch(updateUserInfoAction({ token: 'updated-token' }))
      // 发送登录成功事件
      loginSuccess(from)
    }}>点击登录</button>
  </Fragment>
})

export default View
