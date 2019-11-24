import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import BusinessError from '../Request/BusinessError'
import NetworkError from '../Request/NetworkError'
import AjaxCancelError from 'sunny-js/request/AjaxCancelError'

export default class ErrorBoundary extends PureComponent {
  constructor (props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidMount () {
    // 处理公共网络异常
    document.addEventListener(BusinessError.name, this.errorHandler)
    // 处理公共业务异常
    document.addEventListener(NetworkError.name, this.errorHandler)
    document.addEventListener(AjaxCancelError.name, this.errorHandler)
  }

  componentWillUnmount () {
    // 异步任务一定要在组件被卸载时，能够被清理掉
    // 移除处理公共网络异常
    document.removeEventListener(BusinessError.name, this.errorHandler)
    // 移除处理公共业务异常
    document.removeEventListener(NetworkError.name, this.errorHandler)
    document.removeEventListener(AjaxCancelError.name, this.errorHandler)
  }

  /**
   * 处理请求异常事件
   * @param {BusinessError|NetworkError} error
   */
  errorHandler = ({ data: error }) => {
    console.error(this.constructor.name, error)
  }

  static getDerivedStateFromError () {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch (error, info) {
    // You can also log the error to an error reporting service
    console.error(error, info)
  }

  /**
   * prop types的用法 https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prop-types.md
   */

  static propTypes = {
    children: PropTypes.any.isRequired
  }

  render () {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>
    }

    return this.props.children
  }
}
