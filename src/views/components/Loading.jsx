import React, { Fragment } from 'react'
import { render } from 'react-dom'
import { useElement } from 'sunny-js/util/DOM'

function Loading ({ error, show, retry }) {
  error && console.error(error)
  if (!show) {
    return null
  }

  if (error) {
    return <Fragment>Error! <button onClick={ retry }>Retry</button></Fragment>
  } else {
    return <Fragment>Loading...</Fragment>
  }
}

export default Loading

export function loading (bool = true) {
  render(<Loading show={bool} />, useElement('#loading-container', () => {
    const node = document.createElement('div')
    node.setAttribute('id', 'loading-container')
    return node
  }))
}
export const show = () => loading(true)
export const hide = () => loading(false)

// export function when (assert) {
//
// }
