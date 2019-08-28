import React, { Component, Fragment } from 'react'
import { Redirect } from 'react-router-dom'

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
      </Fragment>
    )
  }
}
