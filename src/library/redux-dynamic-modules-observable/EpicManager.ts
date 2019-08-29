import { getStringRefCounter, IItemManager } from "redux-dynamic-modules";
import { Epic } from "redux-observable";
import { merge, BehaviorSubject, of } from "rxjs";
import { mergeMap, switchMap, mapTo } from 'rxjs/operators'
import { combineEpics, ofType } from 'redux-observable';

export interface IEpicManager extends IItemManager<Epic> {
  rootEpic: Epic;
}

/**
 * Creates an epic manager which manages epics being run in the system
 */
export function getEpicManager(): IEpicManager {
  let runningEpics: Epic[] = [];
  const epicRefCounter = getStringRefCounter();

  const rootEpic: Epic = createRootEpic(runningEpics);

  return {
    getItems: (): Epic[] => runningEpics,
    rootEpic,
    /**
     * 生产版本 epic只能加一次，必须做放重复检查
     * 开发版本可以尝试考虑switchMap来替换已存在的epic
     * @param epics
     */
    add: (epics: Epic[]) => {
      if (!epics) {
        return;
      }

      epics.forEach(e => {
        rootEpic.replace(e);
        epicRefCounter.add(e.name);
        runningEpics.push(e);
      });
    },
    remove: (epics: Epic[]) => {
      if (!epics) {
        return;
      }

      const epicNameMap = epics.reduce((p, e) => {
        p[e.name] = e;
        return p;
      }, {});

      epics.forEach(e => {
        epicRefCounter.remove(e.name);
      });

      runningEpics = runningEpics.filter(e => {
        !!epicNameMap[e.name] && epicRefCounter.getCount(e.name) !== 0;
      });
    },
    dispose: () => {
      runningEpics = null;
    },
  };
}

function createRootEpic(runningEpics: Epic[]): Epic {
  const emptyEpic = action$ => action$.pipe(
    ofType('nothing'),
    mapTo({ type: 'nothing' })
  )
  const epic$ = new BehaviorSubject(emptyEpic)

  const merger = (...args) =>
    epic$.pipe(
      // @ts-ignore
      switchMap(epic => epic(...args))
    );

  // @ts-ignore
  merger.replace = (...args) => epic$.next(...args);

  // Technically the `name` property on Function's are supposed to be read-only.
  // While some JS runtimes allow it anyway (so this is useful in debugging)
  // some actually throw an exception when you attempt to do so.
  try {
    Object.defineProperty(merger, "name", {
      value: "____MODULES_ROOT_EPIC",
    });
  } catch (e) {}

  return merger;
}
