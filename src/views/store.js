import { createStore } from 'redux-dynamic-modules-core'
import { getObservableExtension } from 'redux-dynamic-modules-observable'
import { getThunkExtension } from 'redux-dynamic-modules-thunk'
// import { getThemeModule } from '@/views/components/SwitchTheme/redux/module'

export function configureStore () {
  return createStore(
    {
      extensions: [
        getThunkExtension(),
        getObservableExtension()
      ]
    },
    // getThemeModule()
  )
}

export default configureStore()
