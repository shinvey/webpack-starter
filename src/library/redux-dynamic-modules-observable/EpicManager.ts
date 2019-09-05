import { getObjectRefCounter, IItemManager } from 'redux-dynamic-modules-core'
import { Epic, ofType } from 'redux-observable'
import { Observable, Subject } from 'rxjs'
import { mapTo, switchMap } from 'rxjs/operators'

export interface IEpicManager extends IItemManager<Epic> {
}

interface IEpicWrapper {
  (...args: any[]): Observable<unknown>
  _epic?: Epic
  epicRef(): Epic
  replaceWith(epic: Epic): void
}

/**
 * Creates an epic manager which manages epics being run in the system
 */
export function getEpicManager(epicMiddleware): IEpicManager {
  let runningEpics: object = {}
  // @ts-ignore
  let epicRefCounter = getObjectRefCounter()

  return {
    /**
     * 动态添加epic有
     * epic不可被真正动态删除
     * 防止重复添加
     * 满足module hot load动态更新
     * 不同的module依赖同一个epic
     */
    add: (epics: Epic[]) => {
      if (!epics) {
        return
      }

      epics.forEach((epic: Epic) => {
        const epicKey = epic.toString()
        if (!runningEpics.hasOwnProperty(epicKey)) {
          const replaceableWrapper = createReplaceableWrapper()
          epicMiddleware.run(replaceableWrapper)
          // 让epic生效
          replaceableWrapper.replaceWith(epic)
          /**
           * 储存replaceableWrapper引用，供下次检查
           * Is there a limit on length of the key (string) in JS object? https://stackoverflow.com/questions/13367391/is-there-a-limit-on-length-of-the-key-string-in-js-object
           */
          runningEpics[epicKey] = replaceableWrapper
        }
        // 引用计数，管理依赖关系，在remove时有用
        epicRefCounter.add(epic)
      })
    },
    /**
     * 实现epic移除
     * 目前还没有真正意义上可以移除epic的有效方法，原因请见 https://redux-observable.js.org/docs/recipes/AddingNewEpicsAsynchronously.html
     * 可以使用替换的思路，使用一个空的epic，然后将业务epic switchMap到无任何作用的epic上
     */
    remove: (epics: Epic[]) => {
      if (!epics) {
        return
      }

      epics.forEach((epic: Epic) => {
        epicRefCounter.remove(epic)

        const epicKey = epic.toString()
        const epicWrapper: IEpicWrapper = runningEpics[epicKey]
        if (epicWrapper && !epicRefCounter.getCount(epic)) {
          // 清空epicWrapper内部逻辑
          epicWrapper.replaceWith(emptyEpic)
          // 删除epic引用
          delete runningEpics[epicKey]
        }
      })
    },
    dispose: () => {
      runningEpics = null
      epicRefCounter = undefined
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

function emptyEpic (action$) {
  return action$.pipe(
    ofType('noop'),
    mapTo({ type: 'noop' })
  )
}
