import React, { Fragment, useEffect } from 'react'
import { render } from 'react-dom'
import { useElement } from 'sunny-js/util/DOM'

/**
 * @return {null|ReactNode}
 */
function Loading ({ error, toggle = true, retry }) {
  error && console.error(error)
  if (!toggle) {
    return null
  }

  if (error) {
    return <Fragment>Error! <button onClick={ retry }>Retry</button></Fragment>
  } else {
    return <Fragment>Loading...</Fragment>
  }
}

/**
 * 对外共享loading实例，不再重复创建Loading，避免在视觉上出现loading叠加
 * @return {null}
 */
export default function ReuseLoading ({ toggle, ...props }) {
  useEffect(() => {
    loading(toggle, props)
    return hide
  }, [toggle, props.error])
  return null
}

export function loading (bool = true, options = {}) {
  const loadingContainerID = 'loading-container'
  render(<Loading toggle={bool} {...options} />, useElement('#' + loadingContainerID, { id: loadingContainerID }))
}
export const show = () => loading(true)
export const hide = () => loading(false)

// export function when (assert) {
//
// }
