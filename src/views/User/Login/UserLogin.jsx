import React, { Component, Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import { Login } from 'ant-design-pro'
import { Checkbox } from 'antd'

/**
 * __组件职责说明__
 * 建议：
 * * render函数中不做复杂运算或不调用其他有复杂运算的方法
 * * 避免不必要的render调用
 * * 与代码逻辑状态有关属性（不需要向用户展示的）避免在state或props中声明
 *
 * 可选：
 * * 如果有父子组件通信需求，请定义组件接口。props向下通信，props.onChange向上通信
 * * 如果局部状态管理逻辑足够简单，可以使用state声明
 * * 如果需要处理事件可以声明事件处理方法
 * * 如果组件有风格，可以import私有样式表
 */

const { UserName, Password, Captcha, Submit } = Login

export default class UserLogin extends Component {
  state = {
    redirectToReferrer: false
  }

  /**
   * @type {LoginBiz}
   */
  loginBiz

  constructor (props) {
    super(props)
    this.loginBiz = props.loginBiz
  }

  _handleLogin = (err, values) => {
    console.debug('_handleLogin', err, values)
    !err && this.loginBiz.login(values).then(() => {
      this.setState({ redirectToReferrer: true })
    }).catch(error => {
      // 在公共异常处理逻辑后，可能还需要在业务层处理独有异常交互逻辑
      console.debug(error.message)
    })
  };

  render () {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    const { redirectToReferrer } = this.state

    if (redirectToReferrer) return <Redirect to={from} />

    return (
      <Fragment>
        <p>You must log in to view the page at {from.pathname}</p>
        <Login onSubmit={this._handleLogin}>
          <UserName name="id" placeholder="请输入用户名" defaultValue={15153316879} />
          <Password name="password" placeholder="请输入密码" defaultValue={123} />
          <Captcha
            name="captcha"
            placeholder="验证码"
            getCaptchaButtonText="获取验证码"
            getCaptchaSecondText="秒"
            defaultValue={123}
          />
          <Submit
            type="primary"
            htmlType="submit"
            style={{
              marginTop: '0px'
            }}
          >
            登录
          </Submit>
          <Checkbox defaultChecked={true}>保持登录</Checkbox>
        </Login>
      </Fragment>
    )
  }
}
