/* tslint:disable */

import { getStringRefCounter, getObjectRefCounter, IItemManager } from "redux-dynamic-modules-core";
import { Epic } from "redux-observable";
import { merge, BehaviorSubject, of, Subject } from "rxjs";
import { mergeMap, switchMap, mapTo } from 'rxjs/operators'
import { combineEpics, ofType } from 'redux-observable';

// import { Subject, from, queueScheduler } from 'rxjs';
// const QueueScheduler = queueScheduler.constructor;
// const uniqueQueueScheduler = new QueueScheduler(queueScheduler.SchedulerAction);

export interface IEpicManager extends IItemManager<Epic> {
  // rootEpic: Epic;
}

/**
 * Creates an epic manager which manages epics being run in the system
 */
export function getEpicManager(epicMiddleware): IEpicManager {
  let runningEpics: Object = {};
  // @ts-ignore
  const epicRefCounter = getObjectRefCounter();
  const has = (key) => key in runningEpics;
  const get = (key) => runningEpics[key];
  const key = (namespace, name) => `${namespace}-${name}`
  // const rootEpic: Epic = createRootEpic(runningEpics);

  return <IEpicManager>{
    // @ts-ignore
    // getItems: () => runningEpics,
    // rootEpic,
    /**
     * 动态添加epic有
     * epic不可被真正动态删除
     * 防止重复添加
     * 满足module hot load动态更新
     */
    add: (epics: Epic[], namespace) => {
      if (!epics) {
        return;
      }

      let arrEpicWrapper = runningEpics[namespace] || [];
      runningEpics[namespace] = arrEpicWrapper

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
         * 在使用react-hot-loader时，去修改epic，触发hot load后，getEpicManager会被重新调用，相当于重建
         * 不过这里的判断还是有意义的，在用户离开当前路由，再次回来后，可以防止重复添加epic，造成不可以预知的问题
         */
        if (arrEpicWrapper[index]) {
          let epicWrapper = arrEpicWrapper[index]
          // 如果开启了HMR，尝试替换epic
          // @ts-ignore
          if (module.hot && epicWrapper.epicRef() != epic) {
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
            epicWrapper = undefined
          }
        } else {
          const replaceableWrapper = createReplaceableWrapper()
          epicMiddleware.run(replaceableWrapper)
          // 让epic生效
          replaceableWrapper.replaceWith(epic)
          // 储存replaceableWrapper引用，供下次检查
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
    /**
     * todo 实现epic移除
     * 目前还没有真正意义上可以移除epic的有效方法，原因请见 https://redux-observable.js.org/docs/recipes/AddingNewEpicsAsynchronously.html
     * 可以使用替换的思路，使用一个空的epic，然后将业务epic switchMap到无任何作用的epic上
     */
    remove: (epics: Epic[]) => {
      if (!epics) {
        return
      }

      // const epicNameMap = epics.reduce((p, e) => {
      //   p[e.name] = e;
      //   return p;
      // }, {});

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
  };
}

/**
 * create a wrapper which can be replace by a epic
 * @returns replaceableWrapper
 */
function createReplaceableWrapper () {
  const epic$ = new Subject();

  // 包装一个可以被替换的wrapper
  const replaceableWrapper = (...args) =>
    epic$.pipe(
      // @ts-ignore
      switchMap(epic => epic(...args))
    );

  // 暴露替换方法
  replaceableWrapper.replaceWith = epic => {
    epic$.next(epic);
    replaceableWrapper._epic = epic;
  }
  // 提供epic ref访问接口
  replaceableWrapper.epicRef = () => replaceableWrapper._epic

  return replaceableWrapper;
}

function createRootEpic(runningEpics: Epic[]): Epic {
  const epic$ = new Subject();

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
