import { getStringRefCounter, getObjectRefCounter, IItemManager } from "redux-dynamic-modules-core"
import { Epic } from "redux-observable"
import { merge, BehaviorSubject, of, Subject, Observable } from "rxjs"
import { mergeMap, switchMap, mapTo } from 'rxjs/operators'
import { combineEpics, ofType } from 'redux-observable'

// import { Subject, from, queueScheduler } from 'rxjs';
// const QueueScheduler = queueScheduler.constructor;
// const uniqueQueueScheduler = new QueueScheduler(queueScheduler.SchedulerAction);

export interface IEpicManager extends IItemManager<Epic> {
  // rootEpic: Epic;
}

interface IEpicWrapper {
  (...args: any[]): Observable<unknown>
  _epic?: Epic
  epicRef(): Epic
  replaceWith(epic: Epic): void
}

interface IModule extends NodeModule {
  /**
   * this is referenced to hot module replacement
   */
  hot?: object
}
declare var module: IModule

// const replaceableWrapper: {
//   (...args: any[]): Observable<unknown>;
//   replaceWith(epic: any): void;
//   epicRef(): any;
// }

/**
 * Creates an epic manager which manages epics being run in the system
 */
export function getEpicManager(epicMiddleware): IEpicManager {
  let runningEpics: object = {}
  // @ts-ignore
  const epicRefCounter = getObjectRefCounter()
  const has = (_key) => _key in runningEpics
  const get = (_key) => runningEpics[_key]
  const key = (namespace, name) => `${namespace}-${name}`
  // const rootEpic: Epic = createRootEpic(runningEpics);

  return {
    getItems: () => runningEpics,
    // rootEpic,
    /**
     * 生产版本 epic只能加一次，必须做放重复检查
     * 开发版本可以尝试考虑switchMap来替换已存在的epic
     *
     * todo 避免重复添加epic，可以使用对象key 加 module id
     * todo 实现替换epic
     *
     */
    add: (epics: Epic[], namespace: string) => {
      if (!epics) {
        return
      }

      const arrEpicWrapper: IEpicWrapper[] = runningEpics[namespace] || []

      epics.forEach((epic: Epic, index) => {
        // const epicKey = key(namespace, epic.name)
        // console.debug('check ', epicKey, ' if it existed ', has(epicKey))

        // 发现已经被引用了
        // if (epicRefCounter.getCount(epic)) {
        //   // 如果key不一样，更新key
        //   epicKey ===
        //   // do nothing
        // }

        /**
         * 考虑hot reload场景
         * 当名称一致，函数引用不一致时可以考虑替换
         * fixme 如何处理函数逻辑一致，key更改的情况
         */
        if (arrEpicWrapper[index]) {
          const epicWrapper = arrEpicWrapper[index]
          // 如果开启了HMR，尝试替换epic
          if (module.hot && epicWrapper.epicRef() !== epic) {
            // 更新引用，是为了下一次的判断或对比
            epicRefCounter.remove(epicWrapper.epicRef())
            epicRefCounter.add(epic)
            /**
             * 使用旧epic替换为新epic
             * 不直接替换是因为rxjs本身设计模式，无法卸载已经存在的epic逻辑
             * replaceWith会采用switchMap，来尝试替换旧epic逻辑
             */
            epicWrapper.replaceWith(epic)

            console.info(`[HRM] previous epic ${epicWrapper} is replaced by new epic ${epic}`)
          }
        } else {
          const replaceableWrapper = createReplaceableWrapper()
          epicMiddleware.run(replaceableWrapper)
          // 让epic生效
          replaceableWrapper.replaceWith(epic)
          // 储存epic引用，供下次检查
          arrEpicWrapper[index] = replaceableWrapper
          // 引用计数, 供下次检查
          epicRefCounter.add(epic)
        }
      })
      // epicMiddleware.run(combineEpics(...replaceableWrappers));
      // epics.forEach((e, idx) => replaceableWrappers[idx].replaceWith(e))

      // epics.forEach(e => {
      //   // @ts-ignore
      //   // rootEpic.replace(e);
      //   epicRefCounter.add(e.name);
      //   runningEpics.push(e);
      // });
    },
    remove: (epics: Epic[]) => {
      if (!epics) {
        return
      }

      // const epicNameMap = epics.reduce((p, e) => {
      //   p[e.name] = e;
      //   return p;
      // }, {});

      // fixme 目前还没有真正可以移除epic的有效方法，原因请见 https://redux-observable.js.org/docs/recipes/AddingNewEpicsAsynchronously.html
      // epics.forEach(epic => {
      //   epicRefCounter.remove(epic);
      // });

      // runningEpics = runningEpics.filter(e => {
      //   !!epicNameMap[e.name] && epicRefCounter.getCount(e.name) !== 0;
      // });
    },
    dispose: () => {
      runningEpics = null
    },
  } as IEpicManager
}

/**
 * create a wrapper which can be replace by a epic
 */
function createReplaceableWrapper () {
  const epic$ = new Subject()

  // 包装一个可以被替换的wrapper
  const replaceableWrapper: IEpicWrapper = (...args) =>
    epic$.pipe(
      // @ts-ignore
      switchMap(epic => epic(...args))
    )

  // 暴露替换方法
  replaceableWrapper.replaceWith = epic => {
    epic$.next(epic)
    replaceableWrapper._epic = epic
  }
  // 提供epic ref访问接口
  replaceableWrapper.epicRef = () => replaceableWrapper._epic

  return replaceableWrapper
}

function createRootEpic(runningEpics: Epic[]): Epic {
  const epic$ = new Subject()

  const merger = (...args) =>
    epic$.pipe(
      // @ts-ignore
      switchMap(epic => epic(...args))
    )

  // @ts-ignore
  merger.replace = (...args) => epic$.next(...args)

  // Technically the `name` property on Function's are supposed to be read-only.
  // While some JS runtimes allow it anyway (so this is useful in debugging)
  // some actually throw an exception when you attempt to do so.
  try {
    Object.defineProperty(merger, "name", {
      value: "____MODULES_ROOT_EPIC",
    })
  } catch (e) {}

  return merger
}
