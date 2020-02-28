import React, { FC } from 'react'
import { useDispatch } from 'react-redux'
import { RouteChildrenProps } from 'react-router'
import { loginSuccess } from '../../Auth/channel'
import { updateUserInfoAction } from '../userRDM/userActions'

import { Form, Icon, Input, Button, Checkbox, Select } from 'antd'
import { FormComponentProps } from 'antd/es/form'
import './style.scss'

import { loginSVC } from './service'
import { PluggableRouteProps } from '../../PluggableRouter'
type NormalLoginFormProps = RouteChildrenProps<{}, { from: string }>
  & FormComponentProps & PluggableRouteProps

const { Option } = Select

const NormalLoginForm: FC<NormalLoginFormProps> = (props) => {
  const {
    location: { state: { from } = {} },
    form
  } = props
  const dispatch = useDispatch()
  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        loginSVC(values).then(({ token }) => {
          // 更新用户信息
          dispatch(updateUserInfoAction({ token, role: values.role }))
          // 发送登录成功事件
          loginSuccess(from)
        })
      }
    })
  }

  const { getFieldDecorator } = form

  return <div data-page={'login3'}>
    <Form onSubmit={handleSubmit} className="login-form">
      <Form.Item>
        {getFieldDecorator('username', {
          rules: [{ required: true, message: 'Please input your username!' }],
        })(
          <Input
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Username"
          />,
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('password', {
          rules: [{ required: true, message: 'Please input your Password!' }],
        })(
          <Input
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            placeholder="Password"
          />,
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('role', {
          rules: [{ required: true, message: '选择登录角色!' }],
          initialValue: 'guest'
        })(
          <Select>
            <Option value="guest">访客</Option>
            <Option value="member">会员</Option>
            <Option value="manager">管理员</Option>
            <Option value="admin">超级管理员</Option>
          </Select>,
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('remember', {
          valuePropName: 'checked',
          initialValue: true,
        })(<Checkbox>Remember me</Checkbox>)}
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
      </Form.Item>
    </Form>
  </div>
}

const View = Form.create({ name: 'normal_login' })(NormalLoginForm)

export default View
