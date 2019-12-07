// import { get, cancelAll, isCancel } from '../../Request/ajax'
// import { get, cancelAll, isCancel } from '../../Request/ajaxPromise'
import { get, isCancel } from '../../Request/ajaxPromise'
export const HackerNewsStoriesAvailable = 'hackernews/storiesavailable'
export const HackerNewsLoadStories = 'hackernews/loadstories'

// action creator : StoriesAvailable
export const storiesAvailable = items => {
  return {
    type: HackerNewsStoriesAvailable,
    payload: {
      items
    }
  }
}

// thunk to fetch the stories
export const fetchStories = () => {
  return (dispatch, getState) => {
    fetchJson('https://hacker-news.firebaseio.com/v0/topstories.json').then(
      ids => {
        const top5 = ids.splice(0, 5)
        const promises = []
        for (const id of top5) {
          promises.push(
            fetchJson(
              'https://hacker-news.firebaseio.com/v0/item/' +
              id +
              '.json'
            )
          )
        }
        Promise.all(promises).then(stories => {
          dispatch(storiesAvailable(stories))
        })
      }
    )
  }
}

// Helper to fetch the json
const fetchJson = url => {
  // get(url).then(response => { console.log('fetchJSON', response) })
  //   .catch(err => { console.error('fetchJSON', err) })
  // return get(url, { name: 'Alice' }).then(AjaxResponse => AjaxResponse.response)
  const ajaxP = get(url)
  const result = ajaxP.then(AjaxResponse => AjaxResponse.response)
  result.catch(err => {
    console.error('ajax error', err)
    isCancel(err) && console.log(err.message)
  }).finally(() => {
    console.log('ajax promise complete')
  })
  // ajaxP.cancel()

  // 重试次数设置为1
  // const result = get(url, undefined, { retryTimes: 1 }).then(AjaxResponse => AjaxResponse.response)

  // const result = new Promise((resolve, reject) => {
  //   const ajax$ = get(url)
  //   const subscription = ajax$.subscribe({
  //     next: AjaxResponse => {
  //       console.log('ajax success')
  //       resolve(AjaxResponse.response)
  //     },
  //     error (err) {
  //       console.error('ajax error', err)
  //       reject(err)
  //     },
  //     complete (...args) {
  //       console.log('ajax complete', ...args)
  //     }
  //   })
  //   // subscription.unsubscribe()
  //   // ajax$.cancel()
  // })

  // 取消所有ajax请求
  // cancelAll()
  return result
  // return fetch(url).then(response => {
  //   return response.json()
  // })
}
