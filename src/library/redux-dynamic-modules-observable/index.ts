import { createEpicMiddleware } from "redux-observable"
import { IExtension } from "redux-dynamic-modules-core"
import { getEpicManager } from "./EpicManager"
import { IEpicModule } from "./Contracts"

export function getObservableExtension(): IExtension {
  const epicMiddleware = createEpicMiddleware()
  const epicManager = getEpicManager(epicMiddleware)

  return {
    middleware: [epicMiddleware],
    // onModuleManagerCreated: () => {
    // },
    onModuleAdded: (module: IEpicModule<any>) => {
      if (module.epics) {
        epicManager.add(module.epics)
      }
    },
    onModuleRemoved: (module: IEpicModule<any>) => {
      if (module.epics) {
        epicManager.remove(module.epics)
      }
    },
    dispose: () => {
      epicManager.dispose()
    },
  }
}
