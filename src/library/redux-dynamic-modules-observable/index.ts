import { createEpicMiddleware } from "redux-observable";
import { IExtension } from "redux-dynamic-modules";
import { getEpicManager } from "./EpicManager";
import { IEpicModule } from "./Contracts";

export function getObservableExtension(): IExtension {
    const epicMiddleware = createEpicMiddleware();
    const epicManager = getEpicManager(epicMiddleware);

    return {
        middleware: [epicMiddleware],
        onModuleManagerCreated: () => {
            // epicMiddleware.run(epicManager.rootEpic);
        },
        onModuleAdded: (module: IEpicModule<any>) => {
            if (module.epics) {
                epicManager.add(module.epics, module.id);
            }
        },
        onModuleRemoved: (module: IEpicModule<any>) => {
            if (module.epics) {
                epicManager.remove(module.epics);
            }
        },
    };
}
