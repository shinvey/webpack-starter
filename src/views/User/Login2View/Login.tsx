import { AlipayCircleOutlined, TaobaoCircleOutlined, WeiboCircleOutlined } from '@ant-design/icons'
import { Alert, Checkbox } from 'antd'
// import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { Dispatch } from 'redux'
import { FormComponentProps } from '@ant-design/compatible/es/form'
// import Link from 'umi/link'
import { Link } from 'react-router-dom'
// import { connect } from 'dva'
import { StateType } from './model'
import LoginComponents from './components/Login'
import styles from './style.module.less'

const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginComponents

interface LoginProps {
  dispatch: Dispatch<any>
  BLOCK_NAME_CAMEL_CASE: StateType
  submitting: boolean
}
interface LoginState {
  type: string
  autoLogin: boolean
}
export interface FormDataType {
  userName: string
  password: string
  mobile: string
  captcha: string
}

class Login extends Component<
  LoginProps,
  LoginState
> {
  loginForm: FormComponentProps['form'] | undefined | null = undefined

  state: LoginState = {
    type: 'account',
    autoLogin: true,
  }

  changeAutoLogin = (e: CheckboxChangeEvent) => {
    this.setState({
      autoLogin: e.target.checked,
    })
  }

  handleSubmit = (err: any, values: FormDataType) => {
    const { type } = this.state
    if (!err) {
      const { dispatch } = this.props
      dispatch({
        type: 'BLOCK_NAME_CAMEL_CASE/login',
        payload: {
          ...values,
          type,
        },
      })
    }
  }

  onTabChange = (type: string) => {
    this.setState({ type })
  }

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      if (!this.loginForm) {
        return
      }
      this.loginForm.validateFields(['mobile'], {}, (err: any, values: FormDataType) => {
        if (err) {
          reject(err)
        } else {
          const { dispatch } = this.props;
          ((dispatch({
            type: 'BLOCK_NAME_CAMEL_CASE/getCaptcha',
            payload: values.mobile,
          }) as unknown) as Promise<any>)
            .then(resolve)
            .catch(reject)
        }
      })
    })

  renderMessage = (content: string) => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  )

  render() {
    const { BLOCK_NAME_CAMEL_CASE, submitting } = this.props
    const { status, type: loginType } = { type: 'account', status: 'ok' }
    const { type, autoLogin } = this.state
    return (
      <div className={styles.main}>
        <LoginComponents
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={(form: any) => {
            this.loginForm = form
          }}
        >
          <Tab key="account" tab={'账户密码登录'}>
            {status === 'error' &&
              loginType === 'account' &&
              !submitting &&
              this.renderMessage(
                '账户或密码错误',
              )}
            <UserName
              name="userName"
              placeholder={`用户名: admin or user`}
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ]}
            />
            <Password
              name="password"
              placeholder={`密码: ant.design`}
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
              onPressEnter={e => {
                e.preventDefault()
                if (this.loginForm) {
                  this.loginForm.validateFields(this.handleSubmit)
                }
              }}
            />
          </Tab>
          <Tab key="mobile" tab={'手机号登录'}>
            {status === 'error' &&
              loginType === 'mobile' &&
              !submitting &&
              this.renderMessage(
                '验证码错误',
              )}
            <Mobile
              name="mobile"
              placeholder={'手机号'}
              rules={[
                {
                  required: true,
                  message: '请输入手机号！',
                },
                {
                  pattern: /^1\d{10}$/,
                  message: '手机号格式错误！',
                },
              ]}
            />
            <Captcha
              name="captcha"
              placeholder={'验证码'}
              countDown={120}
              onGetCaptcha={this.onGetCaptcha}
              getCaptchaButtonText={'获取验证码'}
              getCaptchaSecondText={'秒'}
              rules={[
                {
                  required: true,
                  message: '请输入验证码！',
                },
              ]}
            />
          </Tab>
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              自动登录
            </Checkbox>
            <a style={{ float: 'right' }} href="">
              忘记密码
            </a>
          </div>
          <Submit loading={submitting}>
            登录
          </Submit>
          <div className={styles.other}>
            其他登录方式
            <AlipayCircleOutlined className={styles.icon} />
            <TaobaoCircleOutlined className={styles.icon} />
            <WeiboCircleOutlined className={styles.icon} />
            <Link className={styles.register} to="/user/register">
              注册账户
            </Link>
          </div>
        </LoginComponents>
      </div>
    )
  }
}

const ConnectedLogin = connect()(Login)

export default ConnectedLogin
