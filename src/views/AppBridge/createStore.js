import { createStore } from 'redux-dynamic-modules-core'
import { getObservableExtension } from 'redux-dynamic-modules-observable'
import { getThunkExtension } from 'redux-dynamic-modules-thunk'
import { elderApp } from './elder-app.redux.module'

export default (config) => {
  return createStore(
    {
      extensions: [
        getThunkExtension(),
        getObservableExtension()
      ]
    },
    elderApp(config)
  )
}
