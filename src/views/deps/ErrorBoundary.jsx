import React from 'react'
import PropTypes from 'prop-types'

export default class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props)
    this.state = { hasError: false }
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
