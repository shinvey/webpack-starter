import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import BusinessError from '../Request/BusinessError'
import NetworkError from '../Request/NetworkError'
import requestChannel from '../Request/channel'
import AjaxCancelError from 'sunny-js/request/AjaxCancelError'

export default class ErrorBoundary extends PureComponent {
  constructor (props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidMount () {
    this._requestErrorSubscription$ = requestChannel.subscribe(({ payload: error }) =>
      this.errorHandler(error),
    )
  }

  componentWillUnmount () {
    this._requestErrorSubscription$.unsubscribe()
  }

  /**
   * 处理请求异常事件
   * @param {BusinessError|NetworkError} error
   */
  errorHandler = error => {
    console.debug(this.constructor.name, '在这里处理公共异常交互', error)
    switch (error.constructor.name) {
      case BusinessError.name:
        // 处理公共业务异常
        break
      case NetworkError.name:
        // 处理公共网络异常
        break
      case AjaxCancelError.name:
        // 处理请求被取消
        break
    }
  };

  static getDerivedStateFromError () {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch (error, info) {
    // You can also log the error to an error reporting service
    console.error(this.constructor.name, error, info)
  }

  /**
   * prop types的用法 https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prop-types.md
   */

  static propTypes = {
    children: PropTypes.any.isRequired,
  };

  render () {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>
    }

    return this.props.children
  }
}
