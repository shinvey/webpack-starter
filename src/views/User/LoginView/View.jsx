import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { sendAction, createLoginSuccessAction } from '../../Auth/channel'

const View = connect()((props) => {
  const { location: { state: { from } = {} }, dispatch } = props
  return <Fragment>
    <h1>用户登录</h1>
    <button onClick={() => {
      // 更新用户信息
      dispatch({ type: 'user/update', payload: { token: 'updated-token' } })
      // 发送登录成功事件
      sendAction(createLoginSuccessAction(from))
    }}>点击登录</button>
  </Fragment>
})

export default View
