import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import fakeAuth from '../auth'

export default class Login extends Component {
  state = {
    redirectToReferrer: false
  }

  _login () {
    fakeAuth.authenticate().then(() => {
      this.setState({ redirectToReferrer: true })
    })
  };

  render () {
    let { from } = this.props.location.state || { from: { pathname: '/' } }
    let { redirectToReferrer } = this.state

    if (redirectToReferrer) return <Redirect to={from} />

    return (
      <div>
        <p>You must log in to view the page at {from.pathname}</p>
        <button onClick={() => this._login()}>Log in</button>
      </div>
    )
  }
}
